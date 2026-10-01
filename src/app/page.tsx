'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  MessageCircle,
  Globe2,
  Music2,
  Phone,
  Calendar,
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Mic,
  QrCode,
  RotateCcw,
  Sparkles,
  Sliders,
  Palette,
  Eye,
  Download,
  Share2,
  Copy,
} from 'lucide-react';

import { SocialIcon } from '@/components/ui/SocialIcons';

// Creator profiles for the Hero phone preview
const HERO_CREATORS = [
  {
    id: 'music',
    tab: '🎵 Music',
    name: 'Adaeze Okafor',
    handle: 'adaeze',
    category: 'Afrobeats Singer & Producer',
    bio: 'New single "Midnight Lagos" out now on all streaming platforms. Tour dates below.',
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
    tab: '👗 Fashion',
    name: 'Maison Eko',
    handle: 'maisoneko',
    category: 'Contemporary Lagos Atelier',
    bio: 'Handcrafted linen & silk ready-to-wear. Worldwide DHL express shipping.',
    avatar: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&auto=format&fit=crop&q=80',
    theme: {
      bg: '#2b2118',
      text: '#faf6f0',
      bioText: '#c9b9a6',
      btnBg: '#faf6f0',
      btnText: '#2b2118',
      btnRadius: 'rounded-2xl',
    },
    links: [
      {
        title: 'Order SS26 Capsule on WhatsApp',
        badge: 'Instant Order',
        icon: 'wa',
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
    tab: '☕ Café & Food',
    name: 'Kafé Lekki',
    handle: 'kafelekki',
    category: 'Specialty Coffee & Brunch Bar',
    bio: 'Single origin African coffees, warm sourdough & community table. Open 7am - 8pm daily.',
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
        title: 'Order Pickup via WhatsApp (Skip Line)',
        badge: 'Fast Track',
        icon: 'wa',
      },
      {
        title: 'Seasonal Brunch & Coffee Menu',
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
    statSubtitle: '4.9★ rating',
  },
  {
    id: 'media',
    tab: '🎙️ Podcast',
    name: 'Tayo & Kemi',
    handle: 'thelagostalk',
    category: 'Culture & Tech Podcast',
    bio: 'Weekly deep dives into African tech, venture capital, and modern culture. 100k+ listeners.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    theme: {
      bg: '#121214',
      text: '#ffffff',
      bioText: '#a1a1aa',
      btnBg: '#222225',
      btnText: '#ffffff',
      btnRadius: 'rounded-full',
      border: '1px solid rgba(255,255,255,0.08)',
    },
    links: [
      {
        title: 'Ep 84: "Building African Unicorns"',
        badge: 'Latest Ep',
        icon: 'music',
      },
      {
        title: 'Join Telegram VIP Community (12k)',
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

// Customizer themes for Section 1
const CUSTOMIZER_THEMES = [
  {
    id: 'forest-lime',
    name: 'Forest Volt',
    bg: '#1e392a',
    text: '#ffffff',
    bioText: '#a7d5be',
    btnBg: '#d2e823',
    btnText: '#1e392a',
    accent: '#d2e823',
  },
  {
    id: 'hydrangea',
    name: 'Hydrangea',
    bg: '#502274',
    text: '#ffffff',
    bioText: '#e9c0e9',
    btnBg: '#ffffff',
    btnText: '#502274',
    accent: '#e9c0e9',
  },
  {
    id: 'onyx',
    name: 'Onyx Dark',
    bg: '#121214',
    text: '#ffffff',
    bioText: '#9ca3af',
    btnBg: '#27272a',
    btnText: '#ffffff',
    accent: '#38bdf8',
  },
  {
    id: 'sand',
    name: 'Warm Sand',
    bg: '#f6f3eb',
    text: '#292524',
    bioText: '#78716c',
    btnBg: '#292524',
    btnText: '#f6f3eb',
    accent: '#d97706',
  },
  {
    id: 'currant',
    name: 'Currant Wine',
    bg: '#780016',
    text: '#ffffff',
    bioText: '#fbcfe8',
    btnBg: '#ffffff',
    btnText: '#780016',
    accent: '#fda4af',
  },
];

// 3D Flippable Creator Showcase Cards
const CREATOR_CARDS = [
  {
    id: 1,
    name: 'Burna Boy Fan Experience',
    handle: 'onaspaceship',
    category: 'Music & Global Tours',
    tag: 'Afrobeats',
    bgGradient: 'from-amber-600 to-emerald-950',
    coverImg: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Official fan hub for spaceship tour, stadium tickets, and exclusive pop-up merch drops.',
    links: [
      'Pre-save European Stadium Tour',
      'Order Limited Edition Vinyl',
      'VIP WhatsApp Backstage Passes',
    ],
    metric: '48.2k monthly clicks',
  },
  {
    id: 2,
    name: 'Maison Eko Atelier',
    handle: 'maisoneko',
    category: 'Fashion & Luxury Goods',
    tag: 'Fashion',
    bgGradient: 'from-stone-800 to-amber-950',
    coverImg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Bespoke tailoring, linen resort collections, and handmade accessories shipped worldwide.',
    links: [
      'Shop Resort 26 via WhatsApp',
      'View Digital Lookbook',
      'Book Atelier Fitting (VI Lagos)',
    ],
    metric: '₦4.8M monthly GMV',
  },
  {
    id: 3,
    name: 'Chef Femi Oladele',
    handle: 'femicooks',
    category: 'Culinary Pop-ups & Dining',
    tag: 'Food & Dining',
    bgGradient: 'from-red-950 to-orange-950',
    coverImg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    bio: 'Modern West African tasting menus. Secret supper clubs hosted in Lagos, Accra, and London.',
    links: [
      'Reserve Secret Supper Club Table',
      'Order Homemade Suya Spice Jars',
      'Download 10-Recipe Digital Guide',
    ],
    metric: '98% sellout rate',
  },
  {
    id: 4,
    name: 'Tech & Tonic Podcast',
    handle: 'techandtonic',
    category: 'African Tech & Venture',
    tag: 'Media & Tech',
    bgGradient: 'from-blue-950 to-indigo-950',
    coverImg: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    bio: 'Interviews with Africa’s most ambitious founders, seed investors, and product visionaries.',
    links: [
      'Listen on Spotify & Apple Podcasts',
      'Join 14k Member Telegram Group',
      'Sponsor / Inquire for Ep 90+',
    ],
    metric: '120k monthly downloads',
  },
  {
    id: 5,
    name: 'Sola Visual Arts',
    handle: 'solavisuals',
    category: 'Fine Art & Digital Canvas',
    tag: 'Visual Art',
    bgGradient: 'from-purple-950 to-fuchsia-950',
    coverImg: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    bio: 'Exploring African futurism, Yoruba folklore, and contemporary oil portraits on linen.',
    links: [
      'View ArtX Lagos Gallery Collection',
      'Commission a Custom Portrait',
      'Collector Newsletter & Print Drops',
    ],
    metric: '320 original prints sold',
  },
];

export default function LandingPage() {
  const router = useRouter();

  // State for Claim Bar
  const [claimUsername, setClaimUsername] = useState('');
  const [heroTab, setHeroTab] = useState(0);

  // State for Customizer Simulator (Section 1)
  const [customThemeIdx, setCustomThemeIdx] = useState(0);
  const [customRadius, setCustomRadius] = useState<'rounded-full' | 'rounded-2xl' | 'rounded-none'>('rounded-full');
  const [customFont, setCustomFont] = useState<'font-sans' | 'font-serif' | 'font-mono'>('font-sans');

  // State for WhatsApp Simulator (Section 2)
  const [showWaModal, setShowWaModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // State for Analytics Simulator (Section 3)
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'7d' | '30d' | 'all'>('7d');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // State for 3D Creator Cards (Section 4)
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = claimUsername.trim().toLowerCase();
    if (clean) {
      router.push(`/signup?username=${encodeURIComponent(clean)}`);
    } else {
      router.push('/signup');
    }
  };

  const toggleFlip = (id: number) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://bionest.link/kafelekki');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const currentHero = HERO_CREATORS[heroTab];
  const activeCustomTheme = CUSTOMIZER_THEMES[customThemeIdx];

  // Analytics Chart Data
  const chartDays =
    analyticsTimeframe === '7d'
      ? [
          { day: 'Mon', views: 4200, clicks: 1850 },
          { day: 'Tue', views: 5100, clicks: 2190 },
          { day: 'Wed', views: 6400, clicks: 2780 },
          { day: 'Thu', views: 5800, clicks: 2410 },
          { day: 'Fri', views: 7200, clicks: 3120 },
          { day: 'Sat', views: 8900, clicks: 3890 },
          { day: 'Sun', views: 9400, clicks: 4120 },
        ]
      : [
          { day: 'W1', views: 24000, clicks: 10400 },
          { day: 'W2', views: 28500, clicks: 12200 },
          { day: 'W3', views: 33100, clicks: 14500 },
          { day: 'W4', views: 39400, clicks: 17100 },
        ];

  return (
    <div className="min-h-screen bg-[#F3F3F1] text-[#191919] selection:bg-[#D2E823] selection:text-[#1E392A] font-sans antialiased overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR (Linktree Style: Minimal, Sleek, Sticky Pill Actions) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#F3F3F1]/90 backdrop-blur-md border-b border-[#E5E5E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#1E392A] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-sm tracking-tight text-[#D2E823]">B</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#191919]">
              BioNest
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#575753]">
            <a href="#templates" className="hover:text-[#191919] transition-colors">
              Customizer
            </a>
            <a href="#whatsapp" className="hover:text-[#191919] transition-colors">
              WhatsApp Commerce
            </a>
            <a href="#analytics" className="hover:text-[#191919] transition-colors">
              Analytics
            </a>
            <a href="#creators" className="hover:text-[#191919] transition-colors">
              Creators
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="py-2.5 px-5 rounded-full text-xs font-bold text-[#191919] hover:bg-[#E5E5E3] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="py-2.5 px-5 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white text-xs font-bold tracking-wide transition-all shadow-xs active:scale-95 flex items-center gap-2"
            >
              <span>Sign up free</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION: Linktree's Iconic Chartreuse Electric Lime (#D2E823) */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-8 bg-[#D2E823] text-[#1E392A] border-b border-[#1E392A]/10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold Editorial Headline & Claim Bar */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E392A] text-white text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#D2E823] animate-pulse" />
              <span>A link in bio built for you.</span>
            </div>

            {/* Massive Bold Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] text-[#1E392A] leading-[1.02]">
              Everything you are.{' '}
              <span className="block sm:inline opacity-90">
                In one, simple link in bio.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-[#1E392A]/85 font-medium leading-relaxed max-w-xl">
              Join 50,000+ creators, musicians, fashion labels, and local businesses using BioNest to connect their audience, take instant WhatsApp orders, and grow with real analytics.
            </p>

            {/* Claim Username Input Bar */}
            <div className="pt-2 max-w-lg space-y-3">
              <form
                onSubmit={handleClaim}
                className="flex items-center p-2 rounded-full bg-white shadow-xl focus-within:ring-3 focus-within:ring-[#1E392A]/30 transition-all border border-[#1E392A]/15"
              >
                <div className="flex items-center pl-4 text-[#71716E] font-mono text-sm select-none">
                  bionest.link/
                </div>
                <input
                  type="text"
                  value={claimUsername}
                  onChange={(e) => setClaimUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="yourname"
                  className="w-full bg-transparent px-2 text-[#191919] font-mono text-sm font-semibold outline-none placeholder:text-[#A8A8A3]"
                />
                <button
                  type="submit"
                  className="py-3 px-6 sm:px-8 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-transform active:scale-95 shadow-md"
                >
                  <span>Claim BioNest</span>
                  <ArrowRight className="w-4 h-4 text-[#D2E823]" />
                </button>
              </form>

              {/* Live Username Availability Feedback */}
              {claimUsername.trim() ? (
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E392A] animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-[#1E392A]" />
                  <span>bionest.link/{claimUsername} is available! Claim it now.</span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[#1E392A]/80 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 stroke-[3]" /> Free forever
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 stroke-[3]" /> Zero watermarks
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 stroke-[3]" /> Ready in 2 minutes
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Phone Mockup with Category Switcher */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#1E392A]/10 border border-[#1E392A]/15 mb-6 overflow-x-auto max-w-full">
              {HERO_CREATORS.map((creator, idx) => (
                <button
                  key={creator.id}
                  type="button"
                  onClick={() => setHeroTab(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    heroTab === idx
                      ? 'bg-[#1E392A] text-white shadow-xs'
                      : 'text-[#1E392A]/70 hover:text-[#1E392A]'
                  }`}
                >
                  {creator.tab}
                </button>
              ))}
            </div>

            {/* Smartphone Mockup */}
            <div className="relative">
              
              {/* Floating Stat Pill 1 (Top Left) */}
              <div className="absolute -top-4 -left-6 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-[#E5E5E3] shadow-xl animate-bounce duration-1000">
                <div className="w-7 h-7 rounded-xl bg-[#D2E823] flex items-center justify-center text-xs font-bold text-[#1E392A]">
                  ⚡
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#191919]">{currentHero.floatingStat}</p>
                  <p className="text-[10px] text-[#71716E] font-medium">{currentHero.statSubtitle}</p>
                </div>
              </div>

              {/* Floating Stat Pill 2 (Bottom Right) */}
              <div className="absolute -bottom-4 -right-6 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1E392A] text-white text-[11px] font-bold shadow-xl">
                <span className="w-2 h-2 rounded-full bg-[#D2E823]" />
                <span>100% Unbranded Free</span>
              </div>

              {/* Phone Mockup Body */}
              <div className="w-[305px] sm:w-[325px] h-[580px] bg-[#1E2330] rounded-[44px] p-2.5 shadow-2xl phone-mockup-frame relative flex flex-col">
                
                {/* Dynamic Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#1a1a1a] rounded-full mr-3" />
                  <div className="w-2 h-2 bg-blue-950/70 rounded-full" />
                </div>

                {/* Simulated Screen */}
                <div
                  className="w-full h-full rounded-[36px] overflow-hidden flex flex-col items-center px-4 pt-10 pb-6 transition-colors duration-300"
                  style={{
                    backgroundColor: currentHero.theme.bg,
                    color: currentHero.theme.text,
                  }}
                >
                  {/* Avatar */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentHero.avatar}
                    alt={currentHero.name}
                    className="w-16 h-16 rounded-full object-cover shadow-md mb-2 border-2 border-white/25"
                  />

                  {/* Name & Bio */}
                  <h3 className="text-sm font-extrabold text-center leading-tight">
                    {currentHero.name}
                  </h3>
                  <p
                    className="text-[11px] font-mono font-medium mt-0.5"
                    style={{ color: currentHero.theme.bioText }}
                  >
                    @{currentHero.handle}
                  </p>
                  <p
                    className="text-[10px] text-center mt-1.5 max-w-[210px] leading-relaxed line-clamp-2"
                    style={{ color: currentHero.theme.bioText }}
                  >
                    {currentHero.bio}
                  </p>

                  {/* Social Icons Dock */}
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
                    {currentHero.links.map((link, i) => (
                      <div
                        key={i}
                        className={`w-full py-2.5 px-3 flex items-center justify-between text-[11px] font-bold transition-transform hover:scale-[1.03] cursor-pointer shadow-xs ${
                          currentHero.theme.btnRadius
                        }`}
                        style={{
                          backgroundColor: currentHero.theme.btnBg,
                          color: currentHero.theme.btnText,
                          border: currentHero.theme.border || 'none',
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

                  {/* Clean unbranded bottom */}
                  <div className="pt-2 text-center">
                    <span className="text-[9px] opacity-40 font-mono">100% Unbranded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION 1: Linktree's Iconic Deep Hydrangea Purple (#502274) */}
      {/* "Create and customize your BioNest in minutes" with Live Playground */}
      {/* ========================================================================= */}
      <section id="templates" className="py-20 sm:py-28 px-4 sm:px-8 bg-[#502274] text-white border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E9C0E9]">
              Customization Engine
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] leading-[1.05]">
              Create and customize your BioNest in minutes
            </h2>
            <p className="text-base sm:text-lg text-[#E9C0E9]/90 leading-relaxed font-normal">
              Connect your TikTok, Instagram, Twitter, store, music, and WhatsApp catalog. Pick your custom color palette, button curvature, and typography live right below.
            </p>
          </div>

          {/* Interactive Customizer Workbench Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#421b61] rounded-[36px] p-6 sm:p-10 border border-white/10 shadow-2xl">
            
            {/* Customizer Controls (Left 7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Palette Selector */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#E9C0E9] uppercase tracking-wider">
                  <Palette className="w-4 h-4" />
                  <span>Choose Colorway</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CUSTOMIZER_THEMES.map((theme, idx) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setCustomThemeIdx(idx)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        customThemeIdx === idx
                          ? 'border-[#D2E823] bg-white/10 ring-2 ring-[#D2E823]/50'
                          : 'border-white/10 hover:border-white/20 bg-white/5'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full border border-white/30 shrink-0"
                        style={{ backgroundColor: theme.bg }}
                      />
                      <span className="text-xs font-bold truncate">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Shape Selector */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#E9C0E9] uppercase tracking-wider">
                  <Sliders className="w-4 h-4" />
                  <span>Button Geometry</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'Pill (Full Curved)', value: 'rounded-full' },
                    { label: 'Card (Soft Rounded)', value: 'rounded-2xl' },
                    { label: 'Sharp (Minimal Hard)', value: 'rounded-none' },
                  ].map((shape) => (
                    <button
                      key={shape.value}
                      type="button"
                      onClick={() => setCustomRadius(shape.value as any)}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                        customRadius === shape.value
                          ? 'bg-[#D2E823] text-[#1E392A] border-[#D2E823]'
                          : 'bg-white/5 text-white border-white/10 hover:border-white/20'
                      }`}
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography Selector */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#E9C0E9] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Typography Vibe</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'Inter Sans', value: 'font-sans' },
                    { label: 'Playfair Serif', value: 'font-serif' },
                    { label: 'Space Mono', value: 'font-mono' },
                  ].map((font) => (
                    <button
                      key={font.value}
                      type="button"
                      onClick={() => setCustomFont(font.value as any)}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                        customFont === font.value
                          ? 'bg-white text-[#502274] border-white'
                          : 'bg-white/5 text-white border-white/10 hover:border-white/20'
                      }`}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct CTA */}
              <div className="pt-2">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-[#D2E823] hover:bg-[#c4da20] text-[#1E392A] font-extrabold text-sm transition-transform active:scale-95 shadow-xl"
                >
                  <span>Build your BioNest now</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </Link>
              </div>
            </div>

            {/* Live Interactive Preview Screen (Right 5 Cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-[280px] sm:w-[300px] h-[520px] rounded-[36px] p-2 bg-[#121214] shadow-2xl border border-white/10">
                <div
                  className={`w-full h-full rounded-[30px] p-5 flex flex-col items-center text-center justify-between transition-colors duration-300 ${customFont}`}
                  style={{
                    backgroundColor: activeCustomTheme.bg,
                    color: activeCustomTheme.text,
                  }}
                >
                  <div className="w-full flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white/30 mb-2.5"
                    />
                    <h4 className="text-base font-extrabold tracking-tight">
                      Amara Studio
                    </h4>
                    <p
                      className="text-xs font-mono opacity-80 mt-0.5"
                      style={{ color: activeCustomTheme.bioText }}
                    >
                      @amarastudio
                    </p>
                    <p
                      className="text-[11px] leading-relaxed mt-1 opacity-80 line-clamp-2 max-w-[210px]"
                      style={{ color: activeCustomTheme.bioText }}
                    >
                      Art, ceramic sculptures & hand-poured candle studio.
                    </p>
                  </div>

                  {/* Interactive Button Preview */}
                  <div className="w-full space-y-2.5 my-auto">
                    {[
                      { title: 'Shop Handmade Ceramics', icon: ShoppingBag },
                      { title: 'WhatsApp Studio Line', icon: MessageCircle },
                      { title: 'Visit Exhibition Gallery', icon: Globe2 },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          className={`w-full py-2.5 px-4 text-xs font-bold flex items-center justify-between shadow-xs transition-transform hover:scale-[1.02] cursor-pointer ${customRadius}`}
                          style={{
                            backgroundColor: activeCustomTheme.btnBg,
                            color: activeCustomTheme.btnText,
                          }}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </div>
                          <ArrowRight className="w-3 h-3 opacity-60 shrink-0" />
                        </div>
                      );
                    })}
                  </div>

                  <span className="text-[10px] opacity-40 font-mono">
                    100% Unbranded Free
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION 2: Linktree's Currant Red/Burgundy (#780016) */}
      {/* "Share your BioNest anywhere you like!" with WhatsApp & QR Code Simulator */}
      {/* ========================================================================= */}
      <section id="whatsapp" className="py-20 sm:py-28 px-4 sm:px-8 bg-[#780016] text-white border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FBCFE8]">
              Commerce & Share Anywhere
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] leading-[1.05]">
              Share your BioNest from your Instagram, TikTok, WhatsApp & beyond
            </h2>
            <p className="text-base sm:text-lg text-[#FBCFE8]/90 leading-relaxed font-normal">
              In emerging markets, commerce closes in WhatsApp DMs and phone calls. Turn your bio link into an instant checkout counter, and generate vector QR codes for physical storefronts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Interactive WhatsApp Order Flow Simulator */}
            <div className="p-8 sm:p-10 rounded-[36px] bg-[#5C0011] border border-white/10 space-y-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center font-bold text-xl shadow-md">
                  <MessageCircle className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  Instant Prefilled WhatsApp Orders
                </h3>
                <p className="text-sm text-[#FBCFE8]/80 leading-relaxed">
                  No bulky checkout forms. When a follower taps your WhatsApp button, their chat automatically opens with product details, sizes, and quantities prefilled.
                </p>

                {/* Simulated Chat Dialogue Bubble */}
                <div className="p-4 rounded-2xl bg-[#1E2330] border border-white/10 space-y-2 mt-4">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                    <span>Customer Chat Preview</span>
                    <span className="text-emerald-400">● Online</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#005c4b] text-white text-xs leading-relaxed max-w-sm ml-auto shadow-xs">
                    Hello Maison Eko! 👋 I want to order the{' '}
                    <strong>Linen Safari Set (Size M)</strong> from your BioNest page. Please send bank transfer details.
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowWaModal(true)}
                  className="py-3 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 shadow-md"
                >
                  <span>Test WhatsApp Order Flow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Interactive High-Res QR Code Generator */}
            <div className="p-8 sm:p-10 rounded-[36px] bg-[#5C0011] border border-white/10 space-y-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#780016] flex items-center justify-center font-bold text-xl shadow-md">
                  <QrCode className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  Physical Merch & Storefront QR Codes
                </h3>
                <p className="text-sm text-[#FBCFE8]/80 leading-relaxed">
                  Print sharp vector QR codes onto your packaging bags, table tents, flyers, and clothing tags. Offline shoppers scan and land directly on your BioNest page.
                </p>

                {/* Live QR Code Preview Card */}
                <div className="p-5 rounded-2xl bg-white text-[#191919] flex items-center gap-5 shadow-sm">
                  {/* Crisp SVG QR Mockup */}
                  <div className="w-24 h-24 bg-[#191919] rounded-xl p-2 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h2v4h-2v-4zm-4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm2 2h4v2h-4v-2zm0-4h4v2h-4v-2zm-4 4h2v4h-2v-4z" />
                    </svg>
                  </div>
                  <div className="space-y-1 truncate">
                    <p className="text-xs font-mono font-bold text-emerald-700">bionest.link/kafelekki</p>
                    <p className="text-xs font-bold text-[#191919]">Vector SVG & High-Res PNG</p>
                    <p className="text-[11px] text-stone-500">Scan tested on iOS & Android</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-3 px-5 rounded-full bg-white text-[#191919] hover:bg-stone-100 font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 shadow-md"
                >
                  <Copy className="w-3.5 h-3.5 text-stone-600" />
                  <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Demo Link'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION 3: Linktree's Refreshing Mint Green (#E0F6E5) */}
      {/* "Analyze your audience and keep them engaged" with Interactive Chart */}
      {/* ========================================================================= */}
      <section id="analytics" className="py-20 sm:py-28 px-4 sm:px-8 bg-[#E0F6E5] text-[#1E392A] border-b border-[#1E392A]/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1E392A]">
              Audience Intelligence
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] leading-[1.05]">
              Analyze your audience and keep them engaged
            </h2>
            <p className="text-base sm:text-lg text-[#1E392A]/80 leading-relaxed font-normal">
              Track your traffic over time, monitor click-through rates, and learn what converts your audience without an expensive paywall.
            </p>
          </div>

          {/* Interactive Analytics Dashboard Simulator Card */}
          <div className="rounded-[36px] bg-white border border-[#1E392A]/15 p-6 sm:p-10 shadow-xl space-y-8">
            
            {/* Header with Timeframe Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E3]">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#191919] tracking-tight">
                  Performance Overview
                </h3>
                <p className="text-xs text-[#71716E]">Real-time engagement metrics for your bio page</p>
              </div>

              {/* Timeframe Buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#F3F3F1] border border-[#E5E5E3]">
                {[
                  { label: 'Last 7 Days', value: '7d' },
                  { label: 'Last 30 Days', value: '30d' },
                ].map((tf) => (
                  <button
                    key={tf.value}
                    type="button"
                    onClick={() => setAnalyticsTimeframe(tf.value as any)}
                    className={`py-1.5 px-4 rounded-full text-xs font-bold transition-all ${
                      analyticsTimeframe === tf.value
                        ? 'bg-[#1E392A] text-white shadow-xs'
                        : 'text-[#71716E] hover:text-[#191919]'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#F9F9F8] border border-[#E5E5E3] space-y-1">
                <span className="text-[11px] font-bold text-[#71716E] uppercase tracking-wider">
                  Total Views
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#191919]">
                  {analyticsTimeframe === '7d' ? '47,000' : '125,000'}
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+28.4% vs last week</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F9F9F8] border border-[#E5E5E3] space-y-1">
                <span className="text-[11px] font-bold text-[#71716E] uppercase tracking-wider">
                  Unique Clicks
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#191919]">
                  {analyticsTimeframe === '7d' ? '19,340' : '54,200'}
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+19.2%</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F9F9F8] border border-[#E5E5E3] space-y-1">
                <span className="text-[11px] font-bold text-[#71716E] uppercase tracking-wider">
                  Avg. CTR
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#191919]">
                  41.1%
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Top 5% of creators</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F9F9F8] border border-[#E5E5E3] space-y-1">
                <span className="text-[11px] font-bold text-[#71716E] uppercase tracking-wider">
                  WhatsApp Inquiries
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#25D366]">
                  {analyticsTimeframe === '7d' ? '420' : '1,860'}
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Direct conversions</span>
                </div>
              </div>
            </div>

            {/* Interactive Chart + Referrers Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
              
              {/* Interactive Bar Chart (Left 7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#71716E]">
                  <span>Daily Traffic Distribution</span>
                  <span>Hover column to inspect</span>
                </div>

                <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-[#E5E5E3]">
                  {chartDays.map((item, idx) => {
                    const maxVal = analyticsTimeframe === '7d' ? 10000 : 45000;
                    const heightPct = Math.round((item.views / maxVal) * 100);
                    const isHovered = hoveredBar === idx;

                    return (
                      <div
                        key={item.day}
                        onMouseEnter={() => setHoveredBar(idx)}
                        onMouseLeave={() => setHoveredBar(null)}
                        className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                      >
                        {/* Tooltip on hover */}
                        <div
                          className={`text-[10px] font-mono font-bold py-1 px-2 rounded-lg bg-[#191919] text-white transition-opacity ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          {item.views.toLocaleString()} views
                        </div>

                        {/* Bar */}
                        <div
                          className={`w-full rounded-t-xl transition-all duration-300 ${
                            isHovered ? 'bg-[#1E392A] scale-y-105' : 'bg-[#D2E823]'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />

                        {/* Day Label */}
                        <span className="text-[11px] font-bold text-[#71716E] group-hover:text-[#191919]">
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Referrer Platform Distribution (Right 5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold text-[#71716E] uppercase tracking-wider block">
                  Top Traffic Sources
                </span>

                <div className="space-y-3">
                  {[
                    { name: 'Instagram', pct: 54, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
                    { name: 'TikTok', pct: 26, color: 'bg-black' },
                    { name: 'WhatsApp DMs', pct: 14, color: 'bg-[#25D366]' },
                    { name: 'Twitter / X', pct: 6, color: 'bg-sky-500' },
                  ].map((source) => (
                    <div key={source.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-[#191919]">
                        <span>{source.name}</span>
                        <span>{source.pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#E5E5E3] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${source.color}`}
                          style={{ width: `${source.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION 4: Linktree's Iconic 70M+ Creator Showcase (Warm Chalk #F3F3F1) */}
      {/* 3D Flippable Interactive Creator Cards */}
      {/* ========================================================================= */}
      <section id="creators" className="py-20 sm:py-28 px-4 sm:px-8 bg-[#F3F3F1] border-b border-[#E5E5E3]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1E392A]">
              Beloved Creator Community
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-[#191919] leading-[1.05]">
              The only link in bio trusted by 50,000+ creators
            </h2>
            <p className="text-base sm:text-lg text-[#575753] leading-relaxed">
              Tap or hover any card below to flip and see how creators set up their personal corner of the internet.
            </p>
          </div>

          {/* 3D Flippable Creator Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {CREATOR_CARDS.map((card) => {
              const isFlipped = !!flippedCards[card.id];

              return (
                <div
                  key={card.id}
                  className="perspective-1000 h-[420px] cursor-pointer group"
                  onClick={() => toggleFlip(card.id)}
                >
                  <div
                    className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front of Card */}
                    <div className="absolute inset-0 backface-hidden rounded-[32px] overflow-hidden bg-white border border-[#E5E5E3] shadow-md flex flex-col justify-between p-5 hover:border-[#1E392A] transition-all">
                      <div className="space-y-4">
                        {/* Cover Image */}
                        <div className="h-44 rounded-2xl overflow-hidden relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={card.coverImg}
                            alt={card.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                            {card.tag}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-1">
                          <h4 className="text-base font-extrabold text-[#191919] tracking-tight">
                            {card.name}
                          </h4>
                          <p className="text-xs text-[#71716E] font-medium">{card.category}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#E5E5E3] flex items-center justify-between text-xs font-bold text-[#1E392A]">
                        <span>Tap to preview links</span>
                        <RotateCcw className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Back of Card (Flipped) */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[32px] bg-[#1E392A] text-white p-5 border border-white/20 shadow-xl flex flex-col justify-between">
                      <div className="space-y-4">
                        {/* Header with avatar & handle */}
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={card.avatar}
                            alt={card.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#D2E823]"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#D2E823]">@{card.handle}</p>
                            <p className="text-xs text-white/80 line-clamp-1">{card.name}</p>
                          </div>
                        </div>

                        <p className="text-[11px] text-white/80 leading-relaxed line-clamp-2">
                          {card.bio}
                        </p>

                        {/* Interactive Link Pills */}
                        <div className="space-y-2 pt-2">
                          {card.links.map((link, idx) => (
                            <div
                              key={idx}
                              className="w-full py-2 px-3 rounded-xl bg-white text-[#191919] text-[11px] font-bold truncate shadow-xs flex items-center justify-between"
                            >
                              <span className="truncate">{link}</span>
                              <ArrowRight className="w-3 h-3 text-[#1E392A] shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#D2E823] font-bold">
                        <span>{card.metric}</span>
                        <RotateCcw className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CLOSING CTA BANNER: Deep Forest Green (#1E392A) with Chartreuse Lime */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto rounded-[44px] bg-[#1E392A] text-white p-8 sm:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
          
          {/* Subtle Ambient Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D2E823]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] leading-tight">
              Jumpstart your corner of the internet today.
            </h2>
            <p className="text-base text-[#A7D5BE] leading-relaxed">
              Create your bio in less than 2 minutes. Free forever, no credit card required, and 100% unbranded.
            </p>
          </div>

          {/* Embedded Claim Bar */}
          <div className="pt-2 max-w-md mx-auto relative z-10">
            <form
              onSubmit={handleClaim}
              className="flex items-center p-2 rounded-full bg-white shadow-2xl border border-white/20"
            >
              <div className="flex items-center pl-4 text-[#8C8C87] font-mono text-sm select-none">
                bionest.link/
              </div>
              <input
                type="text"
                value={claimUsername}
                onChange={(e) => setClaimUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="yourname"
                className="w-full bg-transparent px-2 text-[#191919] font-mono text-sm font-semibold outline-none placeholder:text-[#B5B5B0]"
              />
              <button
                type="submit"
                className="py-3 px-6 rounded-full bg-[#D2E823] hover:bg-[#c2d820] text-[#191919] font-bold text-xs flex items-center gap-2 shrink-0 transition-transform active:scale-95 shadow-md"
              >
                <span>Get started</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER: Clean Linktree-style footer */}
      {/* ========================================================================= */}
      <footer className="py-12 px-4 sm:px-8 bg-[#F3F3F1] border-t border-[#E5E5E3] text-xs text-[#71716E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#1E392A] flex items-center justify-center text-[#D2E823] font-bold text-xs">
              B
            </div>
            <span className="font-bold text-[#191919] text-sm">BioNest</span>
            <span className="text-[11px] text-[#8C8C87]">© 2026 BioNest Technologies. Built for creators.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
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

      {/* WhatsApp Flow Simulator Modal */}
      {showWaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-[#1E2330] border border-white/10 text-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">WhatsApp Order Flow</h4>
                  <p className="text-[10px] text-emerald-400">Prefilled instant messaging</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWaModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs hover:bg-white/20"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0b141a] border border-white/5 space-y-3">
              <div className="text-[10px] text-stone-400 font-mono text-center">
                Today at 14:32
              </div>
              <div className="p-3.5 rounded-2xl bg-[#005c4b] text-xs leading-relaxed text-white space-y-1.5 shadow-xs">
                <p className="font-semibold">Order Request via BioNest:</p>
                <p>• Item: Linen Safari Set (Size M)</p>
                <p>• Quantity: 1</p>
                <p>• Delivery: Lagos Express</p>
                <p className="text-[10px] text-emerald-200 pt-1">
                  Ready to send directly into merchant’s WhatsApp inbox with zero commission.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowWaModal(false)}
              className="w-full py-3 rounded-full bg-[#25D366] text-white font-bold text-xs hover:bg-[#20ba59] transition-transform active:scale-95 shadow-md"
            >
              Close Simulator
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
