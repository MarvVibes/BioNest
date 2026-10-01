'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledUsername = searchParams.get('username') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth/callback?next=/onboarding${
        prefilledUsername ? `?username=${encodeURIComponent(prefilledUsername)}` : ''
      }`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            preferred_username: prefilledUsername,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push(`/onboarding${prefilledUsername ? `?username=${prefilledUsername}` : ''}`);
      } else {
        setVerificationSent(true);
      }
    } catch {
      setErrorMessage('An unexpected error occurred during signup.');
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setErrorMessage('');
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/onboarding${
            prefilledUsername ? `?username=${encodeURIComponent(prefilledUsername)}` : ''
          }`,
        },
      });
      if (error) {
        setErrorMessage(error.message);
        setGoogleLoading(false);
      }
    } catch {
      setErrorMessage('Unable to connect to Google authentication.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-[#E5E5E3] rounded-[32px] p-6 sm:p-8 shadow-sm relative z-10">
      {verificationSent ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#1E392A] flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#191919]">Check your email</h2>
          <p className="text-xs text-[#71716E] leading-relaxed">
            We sent a verification link to <strong className="text-[#191919]">{email}</strong>.
            Click the link to confirm your account and claim your username.
          </p>
          <div className="pt-4">
            <Link
              href="/login"
              className="inline-flex py-2.5 px-6 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white font-bold text-xs shadow-xs"
            >
              Go to Log in
            </Link>
          </div>
        </div>
      ) : (
        <>
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          {prefilledUsername && (
            <div className="mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
              <span className="text-emerald-950 font-medium">Claiming username:</span>
              <span className="font-mono font-bold text-[#1E392A]">@{prefilledUsername}</span>
            </div>
          )}

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
            className="w-full py-3 px-4 rounded-full border border-[#D8D8D5] hover:bg-[#FAF9F5] text-[#191919] font-semibold text-xs flex items-center justify-center gap-3 transition-colors disabled:opacity-50 shadow-xs"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#71716E]" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign up with Google</span>
          </button>

          <div className="relative my-6 flex items-center justify-center">
            <div className="border-t border-[#E5E5E3] w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-[#8C8C87] uppercase tracking-wider absolute">
              or with email
            </span>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#191919] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-xs font-medium placeholder:text-[#B5B5B0] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#191919] mb-1.5">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-xs font-medium placeholder:text-[#B5B5B0] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8C87] hover:text-[#191919] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-[#71716E] leading-normal">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-[#191919] font-semibold hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#191919] font-semibold hover:underline">
                Privacy Notice
              </Link>.
            </p>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 px-4 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#71716E]">
            Already have a BioNest page?{' '}
            <Link
              href="/login"
              className="text-[#1E392A] hover:underline font-bold transition-colors"
            >
              Log In
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#F3F3F1]">
      <div className="mb-8 text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#1E392A] flex items-center justify-center text-[#D2E823] font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
            B
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[#191919]">
            BioNest
          </span>
        </Link>
        <h1 className="text-xl font-bold text-[#191919]">Join BioNest</h1>
        <p className="text-xs text-[#71716E] mt-1">Claim your link-in-bio page in 2 minutes</p>
      </div>

      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-[#1E392A]" />}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
