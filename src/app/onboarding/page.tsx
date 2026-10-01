'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { compressAndResizeImage } from '@/lib/image-compression';
import {
  Sparkles,
  ArrowRight,
  Check,
  X,
  Loader2,
  Camera,
  Link as LinkIcon,
  Globe,
  MessageCircle,
} from 'lucide-react';

function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryUsername = searchParams.get('username') || '';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [username, setUsername] = useState(queryUsername.toLowerCase());
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'unavailable'
  >('idle');
  const [usernameReason, setUsernameReason] = useState('');

  // Step 2: Profile info
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<Blob | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Step 3: First link
  const [linkType, setLinkType] = useState<'standard' | 'whatsapp'>('whatsapp');
  const [linkTitle, setLinkTitle] = useState('Chat on WhatsApp');
  const [linkUrl, setLinkUrl] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const supabase = createClient();

  useEffect(() => {
    if (!username) {
      setUsernameStatus('idle');
      setUsernameReason('');
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameStatus('checking');
      try {
        const res = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
        const json = await res.json();
        if (json.available) {
          setUsernameStatus('available');
          setUsernameReason('');
        } else {
          setUsernameStatus('unavailable');
          setUsernameReason(json.reason || 'Username is not available');
        }
      } catch {
        setUsernameStatus('idle');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressAndResizeImage(file);
      setAvatarFile(compressed);
      setAvatarPreview(URL.createObjectURL(compressed));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to process avatar');
    }
  };

  const handleFinishOnboarding = async () => {
    setErrorMsg('');
    setSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      let avatarUrl: string | null = null;

      if (avatarFile) {
        const fileExt = 'webp';
        const filePath = `${user.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            upsert: true,
            contentType: 'image/webp',
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
          avatarUrl = publicUrlData.publicUrl;
        }
      }

      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: user.id,
          username: username.toLowerCase().trim(),
          display_name: displayName.trim() || username,
          bio: bio.trim() || null,
          avatar_url: avatarUrl,
        },
        { onConflict: 'id' }
      );

      if (profileError) {
        setErrorMsg(profileError.message);
        setSubmitting(false);
        return;
      }

      if (linkTitle.trim()) {
        if (linkType === 'whatsapp' && whatsappNumber.trim()) {
          await supabase.from('links').insert({
            profile_id: user.id,
            type: 'whatsapp',
            title: linkTitle.trim(),
            whatsapp_number: whatsappNumber.trim(),
            position: 0,
            is_active: true,
          });
        } else if (linkType === 'standard' && linkUrl.trim()) {
          const urlFormatted = linkUrl.startsWith('http') ? linkUrl.trim() : `https://${linkUrl.trim()}`;
          await supabase.from('links').insert({
            profile_id: user.id,
            type: 'standard',
            title: linkTitle.trim(),
            url: urlFormatted,
            position: 0,
            is_active: true,
          });
        }
      }

      router.push('/dashboard');
    } catch {
      setErrorMsg('Failed to complete setup. Please check your connection.');
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {errorMsg}
        </div>
      )}

      {/* STEP 1: Claim Username */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Step 1 of 3
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">Claim your username</h2>
            <p className="text-sm text-slate-400 mt-1">
              This will be your permanent public link that you share everywhere.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Your Link
            </label>
            <div className="flex rounded-xl bg-slate-950/80 border border-slate-800 focus-within:border-emerald-500 transition-colors overflow-hidden">
              <span className="px-3.5 py-3 text-sm text-slate-500 bg-slate-900/60 border-r border-slate-800 flex items-center select-none font-mono">
                bionest.link/
              </span>
              <input
                type="text"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                placeholder="yourname"
                className="w-full px-3.5 py-3 bg-transparent text-white text-sm font-mono outline-none placeholder:text-slate-600"
              />
              <div className="px-3 flex items-center">
                {usernameStatus === 'checking' && (
                  <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                )}
                {usernameStatus === 'available' && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5" />
                    Available
                  </span>
                )}
                {usernameStatus === 'unavailable' && (
                  <span className="flex items-center gap-1 text-xs text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-full">
                    <X className="w-3.5 h-3.5" />
                    Taken
                  </span>
                )}
              </div>
            </div>

            {usernameStatus === 'unavailable' && (
              <p className="text-xs text-rose-400 mt-2">{usernameReason}</p>
            )}
            <p className="text-[11px] text-slate-500 mt-2">
              Use 3-30 lowercase characters, numbers, underscores, or hyphens.
            </p>
          </div>

          <button
            type="button"
            disabled={usernameStatus !== 'available'}
            onClick={() => setStep(2)}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-40 transition-all duration-200"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: Profile Details & Avatar */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Step 2 of 3
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">Setup your profile</h2>
            <p className="text-sm text-slate-400 mt-1">
              Tell people who you are and what you do.
            </p>
          </div>

          {/* Avatar upload */}
          <div className="flex items-center gap-5">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-700 overflow-hidden flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-7 h-7 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                )}
              </div>
              <label className="absolute inset-0 cursor-pointer">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-200">Profile Photo</p>
              <p className="text-[11px] text-slate-400">
                JPG, PNG or WebP under 2 MB. Automatically cropped and optimized.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              maxLength={50}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Adaeze Okafor"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-sm placeholder:text-slate-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Bio (up to 160 characters)
              </label>
              <span className="text-[11px] text-slate-500">{bio.length}/160</span>
            </div>
            <textarea
              rows={3}
              maxLength={160}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Afrobeats artist & producer in Lagos. New single out now!"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-sm placeholder:text-slate-600 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all duration-200"
            >
              <span>Next: Add First Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Add First Link */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Step 3 of 3
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">Add your first link</h2>
            <p className="text-sm text-slate-400 mt-1">
              Start with your WhatsApp contact or your primary website.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setLinkType('whatsapp');
                setLinkTitle('Chat on WhatsApp');
              }}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                linkType === 'whatsapp'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-semibold">WhatsApp Button</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLinkType('standard');
                setLinkTitle('My Website');
              }}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                linkType === 'standard'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-semibold">Web Link</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Button Label
            </label>
            <input
              type="text"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="e.g. Chat on WhatsApp"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-sm"
            />
          </div>

          {linkType === 'whatsapp' ? (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                WhatsApp Number (with country code)
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+2348012345678"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Destination URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-sm"
                />
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleFinishOnboarding}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Publish BioNest Page</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#090d16]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="mb-6 text-center relative z-10 w-full max-w-lg">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-jakarta">
            BioNest
          </span>
        </div>
      </div>

      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-emerald-500" />}>
        <OnboardingWizard />
      </Suspense>
    </div>
  );
}
