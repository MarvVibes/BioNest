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
  Phone,
  Calendar,
  Check,
  X,
  ExternalLink,
  Flame,
  Globe2,
  TrendingUp,
  Music2,
  ShoppingBag,
  Mic,
  Coffee,
  CheckCircle2,
} from 'lucide-react';

import { SocialIcon } from '@/components/ui/SocialIcons';

// Interactive Creator Profiles for Hero Mockup
const CREATOR_PREVIEWS = [
  {
    id: 'music',
    tab: '🎵 Musician',
    name: 'Adaeze Okafor',
    handle: 'adaeze',
    category: 'Afrobeats Singer & Producer',
    bio: 'New single "Midnight Lagos" out now on all platforms. Tour dates below.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    theme: {
      bg: '#1e392a',
      text: '#ffffff',
      bioText: '#a7d5be',
      btnBg: '#ffffff',
      btnText: '#1e392a',
      btnRadius: 'rounded-full',
    },
    links: [
      {
        title: 'Stream "Midnight Lagos" (Spotify / Apple)',
        badge: 'New Single',
        icon: 'music',
        isPrimary: true,
      },
      {
        title: 'VIP Fan Club & Merch (WhatsApp)',
        badge: 'Direct Chat',
        icon: 'wa',
      },
      {
        title: 'Lagos Live Tour Tickets — Dec 20',
        badge: 'Selling Fast',
        icon: 'calendar',
      },
    ],
    floatingStat: '🔥 18.4k streams today',
    statSubtitle: '38% link conversion',
  },
  {
    id: 'fashion',
    tab: '👗 Fashion Label',
    name: 'Maison Eko',
    handle: 'maisoneko',
    category: 'Contemporary Lagos Atelier',
    bio: 'Handcrafted linen & silk ready-to-wear. Worldwide DHL shipping.',
    avatar: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&auto=format&fit=crop&q=80',
    theme: {
      bg: '#faf6f0',
      text: '#2b2118',
      bioText: '#7a6755',
      btnBg: '#2b2118',
      btnText: '#faf6f0',
      btnRadius: 'rounded-xl',
    },
    links: [
      {
        title: 'Order SS26 Capsule on WhatsApp',
        badge: 'Instant Order',
        icon: 'wa',
        isPrimary: true,
      },
      {
        title: 'View Digital Lookbook & Sizes',
        badge: 'Catalog',
        icon: 'globe',
      },
      {
        title: 'Book Private Fitting at Victoria Island',
        badge: 'Concierge',
        icon: 'phone',
      },
    ],
    floatingStat: '💬 42 WhatsApp orders',
    statSubtitle: '₦1.2M volume this week',
  },
  {
    id: 'food',
    tab: '☕ Artisan Café',
    name: 'Kafé Lekki',
    handle: 'kafelekki',
    category: 'Specialty Coffee & Brunch Bar',
    bio: 'Single origin African coffees, warm sourdough & community table. Open 7am - 8pm.',
    avatar: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
    theme: {
      bg: '#f3f3f1',
      text: '#191919',
      bioText: '#6e6e69',
      btnBg: '#ffffff',
      btnText: '#191919',
      btnRadius: 'rounded-2xl',
      border: '1px solid #e5e5e3',
    },
    links: [
      {
        title: 'Order Pickup via WhatsApp (No Waiting)',
        badge: 'Fast Track',
        icon: 'wa',
        isPrimary: true,
      },
      {
        title: 'View Seasonal Brunch & Coffee Menu',
        badge: 'Menu',
        icon: 'globe',
      },
      {
        title: 'Reserve Weekend Brunch Table',
        badge: 'Reservations',
        icon: 'calendar',
      },
    ],
    floatingStat: '☕ 310 daily visitors',
    statSubtitle: 'Average 4.9★ rating',
  },
  {
    id: 'media',
    tab: '🎙️ Podcaster',
    name: 'Tayo & Kemi',
    handle: 'thelagostalk',
    category: 'Culture & Tech Podcast',
    bio: 'Weekly deep dives into African tech, culture, and business. 100k+ monthly listeners.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    theme: {
      bg: '#121214',
      text: '#ffffff',
      bioText: '#a1a1aa',
      btnBg: '#222225',
      btnText: '#ffffff',
      btnRadius: 'rounded-2xl',
      border: '1px solid rgba(255,255,255,0.08)',
    },
    links: [
      {
        title: 'Listen Ep 84: "Building Unicorns in Africa"',
        badge: 'Latest Ep',
        icon: 'music',
        isPrimary: true,
      },
      {
        title: 'Join Telegram VIP Community (12k Members)',
        badge: 'Community',
        icon: 'globe',
      },
      {
        title: 'Sponsor an Episode / Partnerships',
        badge: 'Inquire',
        icon: 'phone',
      },
    ],
    floatingStat: '🎙️ 104k downloads',
    statSubtitle: '#1 Tech Podcast in Nigeria',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [claimUsername, setClaimUsername] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = claimUsername.trim().toLowerCase();
    if (clean) {
      router.push(`/signup?username=${encodeURIComponent(clean)}`);
    } else {
      router.push('/signup');
    }
  };

  const currentPreview = CREATOR_PREVIEWS[activeTab];

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#191919] selection:bg-[#D2E823] selection:text-black font-sans">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#F3F3F1]/85 backdrop-blur-xl border-b border-[#E5E5E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#1E392A] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-sm tracking-tight text-[#D2E823]">B</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#191919]">
              BioNest
            </span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#575753]">
            <a href="#features" className="hover:text-[#191919] transition-colors">
              Features
            </a>
            <a href="#whatsapp" className="hover:text-[#191919] transition-colors">
              WhatsApp Commerce
            </a>
            <a href="#analytics" className="hover:text-[#191919] transition-colors">
              Analytics
            </a>
            <a href="#compare" className="hover:text-[#191919] transition-colors">
              BioNest vs Linktree
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="py-2 px-4 rounded-full text-xs font-semibold text-[#191919] hover:bg-[#EAEAE8] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="py-2.5 px-5 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white text-xs font-semibold tracking-wide transition-all shadow-xs active:scale-95"
            >
              Claim your link
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-8 bg-[#F3F3F1] border-b border-[#E5E5E3] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Username Claim */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E5E3] shadow-xs text-xs font-semibold text-[#1E392A]">
              <span className="w-2 h-2 rounded-full bg-[#D2E823] ring-2 ring-[#1E392A]/20 animate-pulse" />
              <span>Built for African Creators & Businesses</span>
            </div>

            {/* Main Punchy Editorial Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] text-[#191919] leading-[1.04]">
              Everything you are.{' '}
              <span className="text-[#1E392A] block sm:inline">
                In one simple link.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#575753] leading-relaxed max-w-xl font-normal">
              Join creators, musicians, fashion designers, and local businesses using BioNest to connect their audience, take WhatsApp orders, and grow with real analytics. 
              <strong className="text-[#191919] font-semibold"> 100% unbranded on our free plan.</strong>
            </p>

            {/* Claim Username Input Bar */}
            <div className="pt-2 max-w-md">
              <form
                onSubmit={handleClaim}
                className="flex items-center p-1.5 rounded-full bg-white border border-[#D8D8D5] shadow-sm focus-within:border-[#1E392A] focus-within:ring-2 focus-within:ring-[#1E392A]/10 transition-all"
              >
                <div className="flex items-center pl-4 text-[#8C8C87] font-mono text-sm select-none">
                  bionest.link/
                </div>
                <input
                  type="text"
                  value={claimUsername}
                  onChange={(e) => setClaimUsername(e.target.value.toLowerCase().trim())}
                  placeholder="yourname"
                  className="w-full bg-transparent px-2 text-[#191919] font-mono text-sm outline-none placeholder:text-[#B5B5B0]"
                />
                <button
                  type="submit"
                  className="py-3 px-6 rounded-full bg-[#D2E823] hover:bg-[#c2d820] text-[#191919] font-bold text-xs flex items-center gap-2 shrink-0 transition-transform active:scale-95 shadow-xs"
                >
                  <span>Claim link</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </form>

              {/* Micro-trust copy */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-[11px] text-[#767671] font-medium">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#1E392A] stroke-[3]" /> Free forever
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#1E392A] stroke-[3]" /> No watermark on free
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#1E392A] stroke-[3]" /> Sets up in 2 mins
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Creator Phone Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Category Tabs Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-[#E5E5E3] shadow-xs mb-6 overflow-x-auto max-w-full">
              {CREATOR_PREVIEWS.map((creator, idx) => (
                <button
                  key={creator.id}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === idx
                      ? 'bg-[#1E392A] text-white shadow-xs'
                      : 'text-[#656560] hover:text-[#191919]'
                  }`}
                >
                  {creator.tab}
                </button>
              ))}
            </div>

            {/* Realistic Smartphone Frame */}
            <div className="relative">
              {/* Floating Stat Card 1 (Top Left) */}
              <div className="absolute -top-3 -left-6 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-[#E5E5E3] shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-7 h-7 rounded-xl bg-[#D2E823] flex items-center justify-center text-xs">
                  ⚡
                </div>
                <div>
                  <p className="text-xs font-bold text-[#191919]">{currentPreview.floatingStat}</p>
                  <p className="text-[10px] text-[#71716E]">{currentPreview.statSubtitle}</p>
                </div>
              </div>

              {/* Floating Badge (Bottom Right) */}
              <div className="absolute -bottom-3 -right-6 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E392A] text-white text-[11px] font-bold shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D2E823]" />
                <span>100% Unbranded Free</span>
              </div>

              {/* Phone Mockup Body */}
              <div className="w-[300px] sm:w-[325px] h-[580px] bg-[#1E2330] rounded-[44px] p-2.5 shadow-2xl phone-mockup-frame relative flex flex-col">
                {/* Dynamic Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#1a1a1a] rounded-full mr-3" />
                  <div className="w-2 h-2 bg-blue-900/60 rounded-full" />
                </div>

                {/* Simulated Screen */}
                <div
                  className="w-full h-full rounded-[36px] overflow-hidden flex flex-col items-center px-4 pt-11 pb-6 transition-colors duration-300"
                  style={{
                    backgroundColor: currentPreview.theme.bg,
                    color: currentPreview.theme.text,
                  }}
                >
                  {/* Avatar */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentPreview.avatar}
                    alt={currentPreview.name}
                    className="w-16 h-16 rounded-full object-cover shadow-md mb-2 border-2 border-white/20"
                  />

                  {/* Name & Bio */}
                  <h3 className="text-sm font-bold text-center leading-tight">
                    {currentPreview.name}
                  </h3>
                  <p
                    className="text-[11px] opacity-75 font-mono mt-0.5"
                    style={{ color: currentPreview.theme.bioText }}
                  >
                    @{currentPreview.handle}
                  </p>
                  <p
                    className="text-[10px] text-center mt-1.5 max-w-[210px] leading-relaxed line-clamp-2"
                    style={{ color: currentPreview.theme.bioText }}
                  >
                    {currentPreview.bio}
                  </p>

                  {/* Social Dock */}
                  <div className="flex items-center gap-2 my-3 opacity-90">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                      <SocialIcon platform="instagram" size={12} />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                      <MessageCircle className="w-3 h-3 text-[#25D366]" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                      <Music2 className="w-3 h-3 text-[#1DB954]" />
                    </div>
                  </div>


                  {/* Links List */}
                  <div className="w-full space-y-2 mt-1 flex-1">
                    {currentPreview.links.map((link, i) => (
                      <div
                        key={i}
                        className={`w-full py-2.5 px-3 flex items-center justify-between text-[11px] font-semibold transition-transform hover:scale-[1.02] shadow-xs ${
                          currentPreview.theme.btnRadius
                        }`}
                        style={{
                          backgroundColor: currentPreview.theme.btnBg,
                          color: currentPreview.theme.btnText,
                          border: currentPreview.theme.border || 'none',
                        }}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {link.icon === 'wa' ? (
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                          ) : link.icon === 'music' ? (
                            <Music2 className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                          ) : link.icon === 'phone' ? (
                            <Phone className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          ) : (
                            <Globe2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          )}
                          <span className="truncate">{link.title}</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/5 opacity-80 shrink-0">
                          {link.badge}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Clean Footer (No BioNest watermark!) */}
                  <div className="pt-2 text-center">
                    <span className="text-[9px] opacity-40 underline">Report page</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CITY MARQUEE & CREATOR TYPES */}
      <section className="py-6 bg-[#FAF9F5] border-b border-[#E5E5E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="font-bold text-[#1E392A] uppercase tracking-wider text-[11px] shrink-0">
              Trusted by creators across
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-medium text-[#656560]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E392A]" /> Lagos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E392A]" /> Nairobi
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E392A]" /> Accra
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E392A]" /> London
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E392A]" /> Johannesburg
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E392A]" /> Kigali
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E392A]" /> Toronto
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THREE PILLARS (PRD MANDATED: UNBRANDED, REAL ANALYTICS, WHATSAPP COMMERCE) */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-8 bg-white border-b border-[#E5E5E3]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1E392A]">
              Deliberately Different
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-[#191919]">
              Built for how African commerce actually operates.
            </h2>
            <p className="text-base text-[#656560]">
              We solved the three biggest frustrations creators have with Western link-in-bio tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: 100% Unbranded Free */}
            <div className="p-8 rounded-[32px] bg-[#FAF9F5] border border-[#E5E5E3] space-y-5 flex flex-col justify-between hover:border-[#1E392A] transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1E392A] text-[#D2E823] flex items-center justify-center font-bold text-xl shadow-xs">
                  <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-[#191919] tracking-tight">
                  No BioNest Branding on Free Pages
                </h3>
                <p className="text-sm text-[#575753] leading-relaxed">
                  Your bio page is your personal storefront, not a billboard for our software. Linktree forces a logo watermark on your page unless you pay high monthly dollar fees. With BioNest, your free page is 100% clean and unbranded.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E5E5E3]/80 flex items-center justify-between text-xs font-semibold text-[#1E392A]">
                <span>Zero watermarks</span>
                <CheckCircle2 className="w-4 h-4 text-[#1E392A]" />
              </div>
            </div>

            {/* Card 2: Native WhatsApp & Phone Links */}
            <div id="whatsapp" className="p-8 rounded-[32px] bg-[#FAF9F5] border border-[#E5E5E3] space-y-5 flex flex-col justify-between hover:border-[#25D366] transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                  <MessageCircle className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-[#191919] tracking-tight">
                  Direct WhatsApp Orders & Prefilled Chats
                </h3>
                <p className="text-sm text-[#575753] leading-relaxed">
                  In Nigeria, Ghana, and Kenya, deals close in WhatsApp DMs and phone calls. BioNest includes dedicated WhatsApp buttons with custom prefilled messages so your customers can tap and order immediately.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E5E5E3]/80 flex items-center justify-between text-xs font-semibold text-[#1E392A]">
                <span>Instant wa.me integration</span>
                <CheckCircle2 className="w-4 h-4 text-[#1E392A]" />
              </div>
            </div>

            {/* Card 3: Real, Non-Paywalled Analytics */}
            <div id="analytics" className="p-8 rounded-[32px] bg-[#FAF9F5] border border-[#E5E5E3] space-y-5 flex flex-col justify-between hover:border-[#1E392A] transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1E2330] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                  <BarChart3 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-[#191919] tracking-tight">
                  Transparent, Actionable Analytics
                </h3>
                <p className="text-sm text-[#575753] leading-relaxed">
                  Know exactly what content drives revenue. Track daily unique pageviews, link click-through rates, top referrers (Instagram, TikTok, Twitter/X), and countries (Nigeria, UK, US, Canada) without an expensive paywall.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E5E5E3]/80 flex items-center justify-between text-xs font-semibold text-[#1E392A]">
                <span>Full metrics included free</span>
                <CheckCircle2 className="w-4 h-4 text-[#1E392A]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPARISON TABLE: BIONEST VS LINKTREE */}
      <section id="compare" className="py-20 sm:py-28 px-4 sm:px-8 bg-[#F3F3F1] border-b border-[#E5E5E3]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1E392A]">
              Honest Breakdown
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#191919]">
              How BioNest stacks up against Linktree
            </h2>
            <p className="text-sm text-[#656560]">
              Clear pricing, genuine value, and no forced branding on free tiers.
            </p>
          </div>

          <div className="rounded-[32px] bg-white border border-[#E5E5E3] shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E5E5E3] bg-[#FAF9F5]">
                  <th className="py-4 px-6 font-bold text-[#191919]">Feature</th>
                  <th className="py-4 px-6 font-bold text-[#71716E]">Linktree (Free Tier)</th>
                  <th className="py-4 px-6 font-extrabold text-[#1E392A] bg-[#1E392A]/5">
                    BioNest (Free Tier)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E3]">
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#191919]">
                    No Watermark / Branding
                  </td>
                  <td className="py-4 px-6 text-rose-500 font-medium flex items-center gap-1.5">
                    <X className="w-4 h-4 shrink-0" />
                    <span>Branded with Linktree Logo</span>
                  </td>
                  <td className="py-4 px-6 font-bold text-[#1E392A] bg-[#1E392A]/5">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-[#1E392A] stroke-[3]" />
                      <span>100% Unbranded Free</span>
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-6 font-semibold text-[#191919]">
                    Native WhatsApp Prefilled Orders
                  </td>
                  <td className="py-4 px-6 text-stone-500 font-medium">
                    Manual link only
                  </td>
                  <td className="py-4 px-6 font-bold text-[#1E392A] bg-[#1E392A]/5">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-[#1E392A] stroke-[3]" />
                      <span>Dedicated WA Buttons with message</span>
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-6 font-semibold text-[#191919]">
                    Detailed Analytics & Country Origins
                  </td>
                  <td className="py-4 px-6 text-stone-500 font-medium">
                    Basic clicks only (Paywalled)
                  </td>
                  <td className="py-4 px-6 font-bold text-[#1E392A] bg-[#1E392A]/5">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-[#1E392A] stroke-[3]" />
                      <span>Views, CTR, referrers, devices, countries</span>
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-6 font-semibold text-[#191919]">
                    Per-Link Scheduling (UTC)
                  </td>
                  <td className="py-4 px-6 text-rose-500 font-medium flex items-center gap-1.5">
                    <X className="w-4 h-4 shrink-0" />
                    <span>Locked behind Pro tier ($9/mo)</span>
                  </td>
                  <td className="py-4 px-6 font-bold text-[#1E392A] bg-[#1E392A]/5">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-[#1E392A] stroke-[3]" />
                      <span>Full start/end scheduling</span>
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-6 font-semibold text-[#191919]">
                    QR Code Generator (PNG & SVG)
                  </td>
                  <td className="py-4 px-6 text-stone-500 font-medium">
                    Basic PNG
                  </td>
                  <td className="py-4 px-6 font-bold text-[#1E392A] bg-[#1E392A]/5">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-[#1E392A] stroke-[3]" />
                      <span>High-res PNG & Vector SVG download</span>
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-6 font-semibold text-[#191919]">
                    Currency / Billing
                  </td>
                  <td className="py-4 px-6 text-stone-500 font-medium">
                    Billed in USD ($$$)
                  </td>
                  <td className="py-4 px-6 font-bold text-[#1E392A] bg-[#1E392A]/5">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-[#1E392A] stroke-[3]" />
                      <span>Generous Free + Local Naira (NGN) cards</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. BIG CALL TO ACTION BANNER */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto rounded-[40px] bg-[#1E392A] text-white p-8 sm:p-16 text-center space-y-8 relative overflow-hidden shadow-xl">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D2E823]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-tight">
              Ready to claim your corner of the internet?
            </h2>
            <p className="text-base text-[#A7D5BE] leading-relaxed">
              Create your bio in less than 2 minutes. Free forever, no credit card required, and 100% unbranded.
            </p>
          </div>

          <div className="pt-2 max-w-md mx-auto relative z-10">
            <form
              onSubmit={handleClaim}
              className="flex items-center p-1.5 rounded-full bg-white border border-white/20 shadow-xl"
            >
              <div className="flex items-center pl-4 text-[#8C8C87] font-mono text-sm select-none">
                bionest.link/
              </div>
              <input
                type="text"
                value={claimUsername}
                onChange={(e) => setClaimUsername(e.target.value.toLowerCase().trim())}
                placeholder="yourname"
                className="w-full bg-transparent px-2 text-[#191919] font-mono text-sm outline-none placeholder:text-[#B5B5B0]"
              />
              <button
                type="submit"
                className="py-3 px-6 rounded-full bg-[#D2E823] hover:bg-[#c2d820] text-[#191919] font-bold text-xs flex items-center gap-2 shrink-0 transition-transform active:scale-95 shadow-xs"
              >
                <span>Get started</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 px-4 sm:px-8 bg-[#F3F3F1] border-t border-[#E5E5E3] text-xs text-[#71716E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#1E392A] flex items-center justify-center text-[#D2E823] font-bold text-xs">
              B
            </div>
            <span className="font-bold text-[#191919] text-sm">BioNest</span>
            <span className="text-[11px] text-[#8C8C87]">© 2026 BioNest Technologies. Built for creators.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link href="/terms" className="hover:text-[#191919] transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-[#191919] transition-colors">
              Privacy Policy
            </Link>
            <a href="mailto:support@bionest.link" className="hover:text-[#191919] transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
