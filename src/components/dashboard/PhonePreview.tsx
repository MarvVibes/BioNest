'use client';

import React from 'react';
import {
  Globe,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { ThemeConfig, DEFAULT_THEME } from '@/lib/themes';
import { SocialLinkItem } from './SocialLinksModal';
import { LinkType, isLinkScheduledActive } from '@/lib/validation';
import { SocialIcon } from '@/components/ui/SocialIcons';

export interface BioLink {
  id: string;
  type: LinkType;
  title: string;
  url?: string | null;
  whatsapp_number?: string | null;
  message?: string | null;
  position: number;
  is_active: boolean;
  show_from?: string | null;
  show_until?: string | null;
}

export interface ProfileData {
  id?: string;
  username: string;
  display_name: string;
  bio?: string | null;
  avatar_url?: string | null;
  theme?: ThemeConfig;
}

interface PhonePreviewProps {
  profile: ProfileData;
  links: BioLink[];
  socialLinks: SocialLinkItem[];
  theme?: ThemeConfig;
}

export default function PhonePreview({
  profile,
  links,
  socialLinks,
  theme = DEFAULT_THEME,
}: PhonePreviewProps) {
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
    <div className="flex flex-col items-center justify-center py-4">
      {/* Phone Case */}
      <div className="w-[320px] sm:w-[350px] h-[680px] bg-slate-950 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 phone-mockup-frame relative flex flex-col">
        {/* Dynamic Island / Speaker Pill */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-[#111] rounded-full border border-slate-900 mr-4" />
          <div className="w-2.5 h-2.5 bg-blue-950/80 rounded-full border border-slate-800" />
        </div>

        {/* Screen Display Area */}
        <div
          className={`w-full h-full rounded-[40px] overflow-y-auto overflow-x-hidden relative flex flex-col items-center px-5 pt-14 pb-8 transition-all duration-300 ${fontClass}`}
          style={{
            background: theme.background,
            color: theme.pageTextColor,
          }}
        >
          {/* Avatar */}
          <div className="relative mb-3 group">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-white/20"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
                style={{
                  background: theme.buttonBg,
                  color: theme.buttonTextColor,
                }}
              >
                {profile.display_name
                  ? profile.display_name.charAt(0).toUpperCase()
                  : profile.username
                  ? profile.username.charAt(0).toUpperCase()
                  : 'B'}
              </div>
            )}
          </div>

          {/* Display Name & Handle */}
          <h2 className="text-base font-bold text-center tracking-tight leading-snug">
            {profile.display_name || `@${profile.username}`}
          </h2>
          <p
            className="text-xs font-mono opacity-80 mt-0.5 text-center"
            style={{ color: theme.bioColor }}
          >
            @{profile.username || 'username'}
          </p>

          {/* Bio */}
          {profile.bio && (
            <p
              className="text-xs text-center mt-2.5 max-w-[260px] leading-relaxed"
              style={{ color: theme.bioColor }}
            >
              {profile.bio}
            </p>
          )}

          {/* Social Icons */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 my-4">
              {socialLinks.map((s) => (
                <div
                  key={s.platform}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                  style={{
                    background: theme.buttonBg,
                    color: theme.buttonTextColor,
                    border: theme.buttonBorder || 'none',
                  }}
                  title={s.platform}
                >
                  <SocialIcon platform={s.platform} size={15} />
                </div>
              ))}
            </div>
          )}

          {/* Links List */}
          <div className="w-full space-y-3 mt-3 flex-1">
            {links.length === 0 ? (
              <div className="py-12 text-center text-xs opacity-50 px-4">
                No active links to display.
              </div>
            ) : (
              links.map((link) => {
                const isScheduled = link.show_from || link.show_until;
                const isLive = isLinkScheduledActive(
                  link.is_active,
                  link.show_from,
                  link.show_until
                );

                if (link.type === 'header') {
                  return (
                    <div
                      key={link.id}
                      className="pt-2 pb-1 text-center font-bold tracking-wide uppercase text-xs opacity-75"
                    >
                      {link.title}
                    </div>
                  );
                }

                return (
                  <div
                    key={link.id}
                    className={`w-full py-3 px-4 flex items-center justify-between text-xs font-medium transition-all ${
                      theme.buttonRadius
                    } ${!isLive ? 'opacity-40 line-through' : ''}`}
                    style={{
                      background: theme.buttonBg,
                      color: theme.buttonTextColor,
                      border: theme.buttonBorder || 'none',
                      boxShadow: theme.buttonShadow || 'none',
                    }}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {getLinkIcon(link.type)}
                      <span className="truncate">{link.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 opacity-80">
                      {isScheduled && <Calendar className="w-3 h-3 text-amber-400" />}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer - No BioNest branding as mandated by PRD, only report link */}
          <div className="mt-6 pt-3 text-center">
            <span
              className="text-[10px] opacity-40 hover:opacity-80 transition-opacity cursor-pointer underline"
            >
              Report this page
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
