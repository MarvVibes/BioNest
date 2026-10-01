'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Link as LinkIcon,
  Palette,
  BarChart3,
  Settings,
  Share2,
  LogOut,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import QRCodeModal from '@/components/dashboard/QRCodeModal';
import { ProfileData } from '@/components/dashboard/PhonePreview';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // Dev fallback
          setProfile({
            id: 'dev-user-id',
            username: 'adaeze',
            display_name: 'Adaeze Okafor',
            bio: 'Afrobeats artist & creator. New single out now!',
          });
          setLoading(false);
          return;
        }

        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (!userProfile) {
          router.push('/onboarding');
          return;
        }

        setProfile(userProfile);
      } catch (err) {
        console.error('Error loading dashboard session:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router, supabase]);

  const handleCopyLink = () => {
    if (!profile) return;
    const url = `${window.location.origin}/${profile.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { label: 'Links', href: '/dashboard', icon: LinkIcon },
    { label: 'Appearance', href: '/dashboard/appearance', icon: Palette },
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#191919] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E3] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Brand */}
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-[#1E392A] flex items-center justify-center text-[#D2E823] font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                B
              </div>
              <span className="text-lg font-extrabold tracking-tight text-[#191919]">
                BioNest
              </span>
            </Link>

            {/* Navigation Tabs (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 bg-[#F3F3F1] p-1 rounded-full border border-[#E5E5E3]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#1E2330] text-white shadow-xs'
                        : 'text-[#656560] hover:text-[#191919] hover:bg-black/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header: Link Pill & Share */}
          <div className="flex items-center gap-2.5">
            {profile && (
              <div className="hidden sm:flex items-center gap-2 bg-[#F3F3F1] border border-[#E5E5E3] px-3.5 py-1.5 rounded-full text-xs">
                <span className="text-[#71716E] font-mono">
                  bionest.link/<strong className="text-[#191919] font-bold">{profile.username}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-[#71716E] hover:text-[#191919] p-1 transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#1E392A] stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <Link
                  href={`/${profile.username}`}
                  target="_blank"
                  className="text-[#71716E] hover:text-[#191919] p-1 transition-colors"
                  title="Open live page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Share QR Code Button */}
            <button
              type="button"
              onClick={() => setShowQR(true)}
              className="py-1.5 px-4 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            {/* Sign out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="p-2 rounded-full text-[#71716E] hover:text-[#191919] hover:bg-[#EAEAE8] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between gap-1 mt-2.5 pt-2 border-t border-[#E5E5E3] overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#1E2330] text-white font-semibold shadow-xs'
                    : 'text-[#656560]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {children}
      </main>

      {/* QR Code Share Modal */}
      {profile && (
        <QRCodeModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          username={profile.username}
        />
      )}
    </div>
  );
}
