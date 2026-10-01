import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { isLinkScheduledActive } from '@/lib/validation';
import {
  mapReferrer,
  parseDevice,
  isBot,
  generateVisitorHash,
} from '@/lib/analytics-helpers';
import { DEFAULT_THEME, ThemeConfig } from '@/lib/themes';
import PublicBioView from '@/components/public/PublicBioView';
import { BioLink, ProfileData } from '@/components/dashboard/PhonePreview';
import { SocialLinkItem } from '@/components/dashboard/SocialLinksModal';

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, bio, avatar_url')
    .ilike('username', username)
    .eq('disabled', false)
    .maybeSingle();

  if (!profile) {
    return {
      title: 'Page Not Found — BioNest',
    };
  }

  const title = profile.display_name
    ? `${profile.display_name} (@${profile.username})`
    : `@${profile.username}`;

  const description =
    profile.bio || `Check out ${profile.display_name || profile.username}'s bio and links.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : undefined,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : undefined,
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const headerStore = await headers();
  const supabase = createAdminClient();

  // 1. Fetch Profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', username)
    .eq('disabled', false)
    .maybeSingle();

  if (profileError || !profile) {
    notFound();
  }

  // 2. Fetch Active Links
  const { data: rawLinks } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_active', true)
    .order('position', { ascending: true });

  // Filter links respecting scheduling window
  const activeLinks: BioLink[] = (rawLinks || []).filter((l) =>
    isLinkScheduledActive(l.is_active, l.show_from, l.show_until)
  );

  // 3. Fetch Social Links
  const { data: socialLinksData } = await supabase
    .from('social_links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('position', { ascending: true });

  const socialLinks: SocialLinkItem[] = socialLinksData || [];

  // 4. Server-Side View Event Recording
  const userAgent = headerStore.get('user-agent') || '';

  // Filter bots from view counts
  if (!isBot(userAgent)) {
    try {
      const ip =
        headerStore.get('x-forwarded-for')?.split(',')[0].trim() ||
        headerStore.get('x-real-ip') ||
        '127.0.0.1';

      const country =
        headerStore.get('x-vercel-ip-country') ||
        headerStore.get('cf-ipcountry') ||
        headerStore.get('x-country-code') ||
        null;

      const referrerHeader = headerStore.get('referer');
      const referrer = mapReferrer(referrerHeader);
      const device = parseDevice(userAgent);
      const visitorHash = generateVisitorHash(ip, userAgent, profile.id);

      await supabase.from('events').insert({
        profile_id: profile.id,
        type: 'view',
        country,
        referrer,
        device,
        visitor_hash: visitorHash,
      });
    } catch (err) {
      console.error('Failed to log public page view event:', err);
    }
  }

  const profileData: ProfileData = {
    id: profile.id,
    username: profile.username,
    display_name: profile.display_name || profile.username,
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    theme: profile.theme as ThemeConfig,
  };

  return (
    <PublicBioView
      profile={profileData}
      links={activeLinks}
      socialLinks={socialLinks}
      theme={(profile.theme as ThemeConfig) || DEFAULT_THEME}
    />
  );
}
