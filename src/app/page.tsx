'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  MessageCircle,
  Zap,
  Globe2,
  Calendar,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [claimUsername, setClaimUsername] = useState('');

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = claimUsername.trim().toLowerCase();
    if (clean) {
      router.push(`/signup?username=${encodeURIComponent(clean)}`);
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 sticky top-0 z-40 bg-[#070b14]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-jakarta">
              BioNest
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="py-2 px-4 rounded-xl text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
            >
              Claim your link
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-28 px-4 sm:px-8 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-teal-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for Creators & Businesses in Nigeria & Africa</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] font-jakarta">
            One link for your{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
              entire world.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            Everything you make, sell, and share in a single link. Free unbranded bio pages,
            real-time visit analytics, native WhatsApp buttons, and automatic link scheduling.
          </p>

          {/* Claim Link Input CTA */}
          <div className="pt-4 max-w-md mx-auto">
            <form
              onSubmit={handleClaim}
              className="flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl focus-within:border-emerald-500 transition-colors"
            >
              <div className="flex items-center pl-3 text-slate-400 font-mono text-sm select-none">
                bionest.link/
              </div>
              <input
                type="text"
                value={claimUsername}
                onChange={(e) => setClaimUsername(e.target.value.toLowerCase().trim())}
                placeholder="yourname"
                className="w-full bg-transparent px-2 text-white font-mono text-sm outline-none placeholder:text-slate-600"
              />
              <button
                type="submit"
                className="py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <span>Claim link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            <p className="text-[11px] text-slate-500 mt-2">
              Free forever. No credit card required. Ready in under 3 minutes.
            </p>
          </div>
        </div>

        {/* HERO MOCKUP CARD */}
        <div className="mt-16 max-w-sm mx-auto relative z-10">
          <div className="p-6 rounded-[36px] bg-slate-950/90 border border-slate-800 shadow-2xl space-y-4 ring-1 ring-white/10 backdrop-blur-xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 mb-3 shadow-xl">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-black text-emerald-400 font-jakarta">
                  A
                </div>
              </div>
              <h2 className="text-base font-bold text-white">Adaeze Okafor</h2>
              <p className="text-xs font-mono text-emerald-400">@adaeze</p>
              <p className="text-xs text-slate-400 mt-1.5 max-w-[240px]">
                Afrobeats singer-songwriter & founder of Lagos Studio 99.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="py-3 px-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-between shadow-md">
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Order on WhatsApp
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>

              <div className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium text-xs flex items-center justify-between">
                <span>Stream New Single &quot;Midnight Lagos&quot;</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium text-xs flex items-center justify-between">
                <span>Upcoming Tour Dates & Tickets</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Zero branding footer demo */}
            <div className="pt-2 text-center">
              <span className="text-[10px] text-slate-600 underline">Report this page</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 CORE PILLARS SECTION (PRD 5 & 9) */}
      <section className="py-20 px-4 sm:px-8 bg-slate-950/60 border-t border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Why BioNest?
            </h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight font-jakarta">
              Built deliberately different from the dollar-charging giants.
            </h3>
            <p className="text-sm text-slate-400">
              We took everything creators love about link-in-bio tools and fixed the 3 biggest pain points.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Clean Unbranded Free Pages */}
            <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4 relative group hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">No BioNest Branding on Free</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Free users shouldn&apos;t be billboards. Your public bio page is 100% yours with
                no watermark or corporate logo at the bottom.
              </p>
            </div>

            {/* 2. Real Analytics */}
            <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4 relative group hover:border-teal-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Actionable, Real Analytics</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Other tools lock analytics behind high dollar subscriptions. BioNest gives you daily views,
                clicks, CTR, countries, referrers, and devices for free.
              </p>
            </div>

            {/* 3. WhatsApp & Phone Buttons */}
            <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4 relative group hover:border-sky-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Direct WhatsApp & Phone</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                In Nigeria and across Africa, business closes on WhatsApp and phone calls.
                Add instant wa.me buttons with customized prefilled orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-jakarta">
              How BioNest Compares
            </h3>
            <p className="text-xs text-slate-400">See how we stack up against Linktree</p>
          </div>

          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60">
                  <th className="py-4 px-6 font-semibold text-slate-300">Feature</th>
                  <th className="py-4 px-6 font-semibold text-slate-500">Market Leader (Linktree)</th>
                  <th className="py-4 px-6 font-bold text-emerald-400 bg-emerald-500/5">BioNest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-200">No Watermark on Free Pages</td>
                  <td className="py-4 px-6 text-rose-400 flex items-center gap-1.5">
                    <X className="w-4 h-4 shrink-0" />
                    <span>Branded with Linktree logo</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-emerald-400 bg-emerald-500/5">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>100% Unbranded Free</span>
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-6 font-medium text-slate-200">WhatsApp with Prefilled Text</td>
                  <td className="py-4 px-6 text-slate-400">Basic link only</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400 bg-emerald-500/5">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Built-in wa.me generator</span>
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-6 font-medium text-slate-200">Free Detailed Analytics</td>
                  <td className="py-4 px-6 text-slate-400">Only basic lifetime totals</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400 bg-emerald-500/5">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>CTR, Referrers, Countries, Devices</span>
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-6 font-medium text-slate-200">Speed on Weak 3G</td>
                  <td className="py-4 px-6 text-slate-400">Heavy JS bundle & trackers</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400 bg-emerald-500/5">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Under 100KB, loads in &lt;2s</span>
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-6 font-medium text-slate-200">Link Scheduling</td>
                  <td className="py-4 px-6 text-slate-400">Locked on Paid plans</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400 bg-emerald-500/5">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Included free</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-4 sm:px-8 border-t border-slate-800/80 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-xl mx-auto space-y-5 relative z-10">
          <h3 className="text-3xl font-extrabold text-white tracking-tight font-jakarta">
            Ready to claim your link?
          </h3>
          <p className="text-sm text-slate-400">
            Join thousands of creators and entrepreneurs putting BioNest in their social profile.
          </p>
          <div className="pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 py-3.5 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-all"
            >
              <span>Get your free BioNest page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-10 px-4 sm:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="font-semibold text-slate-300">BioNest</span>
            <span>— The clean link-in-bio tool.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Notice
            </Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">
              Log In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
