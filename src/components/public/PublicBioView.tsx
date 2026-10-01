'use client';

import React, { useState } from 'react';
import {
  Globe,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { ThemeConfig, DEFAULT_THEME } from '@/lib/themes';
import { BioLink, ProfileData } from '@/components/dashboard/PhonePreview';
import { SocialLinkItem } from '@/components/dashboard/SocialLinksModal';
import { LinkType } from '@/lib/validation';
import { SocialIcon } from '@/components/ui/SocialIcons';
import ReportModal from './ReportModal';

interface PublicBioViewProps {
  profile: ProfileData;
  links: BioLink[];
  socialLinks: SocialLinkItem[];
  theme?: ThemeConfig;
}

export default function PublicBioView({
  profile,
  links,
  socialLinks,
  theme = DEFAULT_THEME,
}: PublicBioViewProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const getLinkIcon = (type: LinkType) => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-emerald-400" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-sky-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-amber-400" />;
      case 'standard':
        return <Globe className="w-4 h-4 text-slate-400" />;
      default:
        return null;
    }
  };

  const fontClass =
    theme.fontFamily === 'Outfit'
      ? 'font-outfit'
      : theme.fontFamily === 'Space Grotesk'
      ? 'font-space'
      : theme.fontFamily === 'Plus Jakarta Sans'
      ? 'font-jakarta'
      : theme.fontFamily === 'Playfair Display'
      ? 'font-playfair'
      : 'font-inter';

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-8 transition-colors ${fontClass}`}
      style={{
        background: theme.background,
        color: theme.pageTextColor,
      }}
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center pt-8 sm:pt-14 pb-12">
        {/* Profile Avatar */}
        <div className="mb-4 relative">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="w-24 h-24 rounded-full object-cover shadow-2xl ring-2 ring-white/20"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-extrabold shadow-2xl"
              style={{
                background: theme.buttonBg,
                color: theme.buttonTextColor,
              }}
            >
              {profile.display_name?.charAt(0).toUpperCase() ||
                profile.username?.charAt(0).toUpperCase() ||
                'B'}
            </div>
          )}
        </div>

        {/* Display Name & Handle */}
        <h1 className="text-xl sm:text-2xl font-bold text-center tracking-tight leading-snug">
          {profile.display_name || `@${profile.username}`}
        </h1>
        <p
          className="text-xs sm:text-sm font-mono opacity-80 mt-1 text-center"
          style={{ color: theme.bioColor }}
        >
          @{profile.username}
        </p>

        {/* Bio */}
        {profile.bio && (
          <p
            className="text-sm text-center mt-3 max-w-sm leading-relaxed px-2"
            style={{ color: theme.bioColor }}
          >
            {profile.bio}
          </p>
        )}

        {/* Social Icons Row */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 my-5">
            {socialLinks.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-115 active:scale-95 shadow-md"
                style={{
                  background: theme.buttonBg,
                  color: theme.buttonTextColor,
                  border: theme.buttonBorder || 'none',
                }}
                title={s.platform}
              >
                <SocialIcon platform={s.platform} size={16} />
              </a>
            ))}
          </div>
        )}

        {/* Links List */}
        <div className="w-full space-y-3.5 mt-2">
          {links.length === 0 ? (
            <div className="py-12 text-center text-xs opacity-50">
              No active links currently available.
            </div>
          ) : (
            links.map((link) => {
              if (link.type === 'header') {
                return (
                  <div
                    key={link.id}
                    className="pt-4 pb-1 text-center font-bold tracking-wider uppercase text-xs opacity-75"
                  >
                    {link.title}
                  </div>
                );
              }

              // All link clicks route through /go/[linkId] for resilient click tracking
              return (
                <a
                  key={link.id}
                  href={`/go/${link.id}`}
                  className={`w-full py-3.5 px-5 flex items-center justify-between text-sm font-semibold transition-all hover:scale-[1.015] active:scale-[0.985] group ${theme.buttonRadius}`}
                  style={{
                    background: theme.buttonBg,
                    color: theme.buttonTextColor,
                    border: theme.buttonBorder || 'none',
                    boxShadow: theme.buttonShadow || 'none',
                  }}
                >
                  <div className="flex items-center gap-3 truncate">
                    {getLinkIcon(link.type)}
                    <span className="truncate">{link.title}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                </a>
              );
            })
          )}
        </div>
      </div>

      {/* Footer: Absolutely NO BioNest branding as required by PRD! Only Report Link */}
      <footer className="w-full text-center pb-4 pt-2">
        <button
          type="button"
          onClick={() => setReportModalOpen(true)}
          className="text-[11px] opacity-40 hover:opacity-90 transition-opacity underline focus:outline-none"
        >
          Report this page
        </button>
      </footer>

      {/* Report Modal */}
      {profile.id && (
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          profileId={profile.id}
          username={profile.username}
        />
      )}
    </div>
  );
}
