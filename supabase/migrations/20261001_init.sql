-- BioNest Supabase Schema & Row-Level Security (RLS)
-- Version 1.0

-- 1. Enable pgcrypto / uuid-ossp if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create PROFILES table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme JSONB DEFAULT '{
    "id": "classic_dark",
    "name": "Classic Dark",
    "background": "#0f172a",
    "cardBackground": "#1e293b",
    "textColor": "#f8fafc",
    "buttonColor": "#334155",
    "buttonTextColor": "#ffffff",
    "buttonRadius": "rounded-xl",
    "font": "Inter"
  }'::jsonb,
  plan TEXT NOT NULL DEFAULT 'free',
  disabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT username_format_check CHECK (
    username ~* '^[a-z0-9][a-z0-9_-]{2,29}$'
  )
);

-- Index for fast public username lookup
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (LOWER(username));

-- 3. Create LINKS table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('standard', 'whatsapp', 'phone', 'email', 'header')),
  title TEXT NOT NULL,
  url TEXT,
  whatsapp_number TEXT,
  message TEXT,
  position INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  show_from TIMESTAMPTZ,
  show_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_links_profile_position ON public.links (profile_id, position ASC);

-- 4. Create SOCIAL_LINKS table
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_social_links_profile ON public.social_links (profile_id, position ASC);

-- 5. Create EVENTS table (views and clicks)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.links(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('view', 'click')),
  country TEXT,
  referrer TEXT,
  device TEXT,
  visitor_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Crucial index for fast analytics queries per profile
CREATE INDEX IF NOT EXISTS idx_events_profile_created ON public.events (profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_link_created ON public.events (link_id, created_at DESC);

-- 6. Create REPORTS table (abuse reporting)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- PROFILES Policies
-- Owners have full CRUD on their profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- Public can view active, non-disabled profiles
CREATE POLICY "Public can view active profiles"
  ON public.profiles FOR SELECT
  USING (disabled = false);

-- LINKS Policies
-- Owners have full CRUD on their links
CREATE POLICY "Owners can manage own links"
  ON public.links FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Public can view active and scheduled links
CREATE POLICY "Public can view scheduled active links"
  ON public.links FOR SELECT
  USING (
    is_active = true
    AND (show_from IS NULL OR show_from <= now())
    AND (show_until IS NULL OR show_until >= now())
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = links.profile_id AND profiles.disabled = false
    )
  );

-- SOCIAL LINKS Policies
-- Owners can manage their social links
CREATE POLICY "Owners can manage own social links"
  ON public.social_links FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Public can view social links of active profiles
CREATE POLICY "Public can view social links"
  ON public.social_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = social_links.profile_id AND profiles.disabled = false
    )
  );

-- EVENTS Policies
-- No client inserts allowed (inserts happen through server route with service role key)
CREATE POLICY "Owners can view own events"
  ON public.events FOR SELECT
  USING (auth.uid() = profile_id);

-- REPORTS Policies
-- Anyone can insert a report (anonymous abuse reporting)
CREATE POLICY "Anyone can submit a report"
  ON public.reports FOR INSERT
  WITH CHECK (true);

-- Only service role can read reports (no client select policy)

-- 8. STORAGE BUCKET CONFIGURATION (for Supabase Storage)
-- Run in Supabase SQL editor:
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Public avatar access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );
