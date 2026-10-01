'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
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
  const [linkTitle, setLinkTitle] = useState('Order on WhatsApp');
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
        const linkPayload = {
          profile_id: user.id,
          type: linkType,
          title: linkTitle.trim(),
          url: linkType === 'standard' ? linkUrl.trim() : null,
          whatsapp_number: linkType === 'whatsapp' ? whatsappNumber.trim() : null,
          position: 0,
          is_active: true,
        };

        await supabase.from('links').insert(linkPayload);
      }

      router.push('/dashboard');
    } catch {
      setErrorMsg('Failed to complete onboarding. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white border border-[#E5E5E3] rounded-[36px] p-6 sm:p-10 shadow-sm relative z-10">
      {/* Progress Dots */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5E5E3]">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === s
                  ? 'w-8 bg-[#1E392A]'
                  : step > s
                  ? 'w-4 bg-[#A7D5BE]'
                  : 'w-2 bg-[#E5E5E3]'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-[#71716E]">
          Step {step} of 3
        </span>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-in fade-in">
          {errorMsg}
        </div>
      )}

      {/* STEP 1: Claim Username */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-2xl font-extrabold text-[#191919] tracking-tight">
              Claim your unique bio link
            </h2>
            <p className="text-xs text-[#71716E] mt-1 leading-relaxed">
              This will be your permanent public link that you share in your Instagram bio, TikTok, and business cards.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#191919] mb-2">
              Your Link URL
            </label>
            <div className="flex rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus-within:border-[#1E392A] transition-colors overflow-hidden">
              <span className="px-3.5 py-3 text-sm text-[#71716E] bg-[#F3F3F1] border-r border-[#E5E5E3] flex items-center select-none font-mono">
                bionest.link/
              </span>
              <input
                type="text"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                placeholder="yourname"
                className="w-full px-3.5 py-3 bg-transparent text-[#191919] text-sm font-mono font-medium outline-none placeholder:text-[#B5B5B0]"
              />
              <div className="px-3 flex items-center">
                {usernameStatus === 'checking' && (
                  <Loader2 className="w-4 h-4 text-[#71716E] animate-spin" />
                )}
                {usernameStatus === 'available' && (
                  <span className="flex items-center gap-1 text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Available
                  </span>
                )}
                {usernameStatus === 'unavailable' && (
                  <span className="flex items-center gap-1 text-xs text-rose-800 font-bold bg-rose-100 px-2.5 py-0.5 rounded-full">
                    <X className="w-3.5 h-3.5" />
                    Taken
                  </span>
                )}
              </div>
            </div>

            {usernameStatus === 'unavailable' && (
              <p className="text-xs text-rose-600 mt-2 font-medium">{usernameReason}</p>
            )}
            <p className="text-[11px] text-[#8C8C87] mt-2">
              Use 3-30 lowercase characters, numbers, underscores, or hyphens.
            </p>
          </div>

          <button
            type="button"
            disabled={usernameStatus !== 'available'}
            onClick={() => setStep(2)}
            className="w-full py-3.5 px-5 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs disabled:opacity-40 transition-transform active:scale-95"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* STEP 2: Profile Details & Avatar */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-2xl font-extrabold text-[#191919] tracking-tight">
              Set up your profile
            </h2>
            <p className="text-xs text-[#71716E] mt-1 leading-relaxed">
              Tell your fans and clients who you are and what you do.
            </p>
          </div>

          {/* Avatar upload */}
          <div className="flex items-center gap-5">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-full bg-[#F3F3F1] border-2 border-dashed border-[#D8D8D5] overflow-hidden flex items-center justify-center group-hover:border-[#1E392A] transition-colors shadow-xs">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-6 h-6 text-[#8C8C87] group-hover:text-[#1E392A] transition-colors" />
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
              <p className="text-xs font-bold text-[#191919]">Profile Photo</p>
              <p className="text-[11px] text-[#71716E]">
                JPG, PNG or WebP under 2 MB. Automatically cropped.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#191919] mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              maxLength={50}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Adaeze Okafor"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-xs font-medium placeholder:text-[#B5B5B0]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-[#191919]">
                Bio (up to 160 characters)
              </label>
              <span className="text-[11px] text-[#8C8C87]">{bio.length}/160</span>
            </div>
            <textarea
              rows={3}
              maxLength={160}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Afrobeats singer-songwriter based in Lagos. New single out now!"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-xs font-medium placeholder:text-[#B5B5B0] resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-3 px-6 rounded-full bg-[#F3F3F1] hover:bg-[#EAEAE8] text-[#71716E] text-xs font-semibold transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 py-3 px-5 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <span>Next: Add First Link</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Add First Link */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-2xl font-extrabold text-[#191919] tracking-tight">
              Add your first link
            </h2>
            <p className="text-xs text-[#71716E] mt-1 leading-relaxed">
              Start with your WhatsApp contact or your primary online website.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setLinkType('whatsapp');
                setLinkTitle('Order on WhatsApp');
              }}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                linkType === 'whatsapp'
                  ? 'border-[#25D366] bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                  : 'border-[#E5E5E3] bg-[#FAF9F5] text-[#71716E] hover:border-[#B5B5B0]'
              }`}
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <span className="text-xs">WhatsApp Button</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLinkType('standard');
                setLinkTitle('My Website');
              }}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                linkType === 'standard'
                  ? 'border-[#1E392A] bg-[#1E392A]/5 text-[#1E392A] font-bold shadow-xs'
                  : 'border-[#E5E5E3] bg-[#FAF9F5] text-[#71716E] hover:border-[#B5B5B0]'
              }`}
            >
              <Globe className="w-5 h-5 text-[#71716E]" />
              <span className="text-xs">Web Link</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#191919] mb-1.5">
              Button Label
            </label>
            <input
              type="text"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="e.g. Chat on WhatsApp"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-xs font-medium"
            />
          </div>

          {linkType === 'whatsapp' ? (
            <div>
              <label className="block text-xs font-bold text-[#191919] mb-1.5">
                WhatsApp Phone Number (with country code)
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+2348012345678"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-xs font-mono font-medium"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-[#191919] mb-1.5">
                Destination URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-xs font-medium"
                />
                <LinkIcon className="w-4 h-4 text-[#8C8C87] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="py-3 px-6 rounded-full bg-[#F3F3F1] hover:bg-[#EAEAE8] text-[#71716E] text-xs font-semibold transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleFinishOnboarding}
              className="flex-1 py-3 px-5 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 disabled:opacity-50"
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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#F3F3F1]">
      <div className="mb-6 text-center relative z-10 w-full max-w-lg">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-2 group">
          <div className="w-9 h-9 rounded-xl bg-[#1E392A] flex items-center justify-center text-[#D2E823] font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
            B
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#191919]">
            BioNest
          </span>
        </Link>
      </div>

      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-[#1E392A]" />}>
        <OnboardingWizard />
      </Suspense>
    </div>
  );
}
