import React from 'react';
import { Globe } from 'lucide-react';

interface SocialIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function InstagramIcon({ size = 16, className = '', ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function TikTokIcon({ size = 16, className = '', ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.34 6.34 0 0 0-.86-.06 6.34 6.34 0 1 0 6.34 6.34V8.71a8.28 8.28 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1-.09z" />
    </svg>
  );
}

export function XIcon({ size = 16, className = '', ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function YoutubeIcon({ size = 16, className = '', ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" />
    </svg>
  );
}

export function FacebookIcon({ size = 16, className = '', ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function LinkedinIcon({ size = 16, className = '', ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function GithubIcon({ size = 16, className = '', ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function TelegramIcon({ size = 16, className = '', ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="22" x2="11" y1="2" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function SpotifyIcon({ size = 16, className = '', ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.58 14.43a.62.62 0 0 1-.86.2 12.56 12.56 0 0 0-7.14-1.9 12.3 12.3 0 0 0-2.41.24.63.63 0 0 1-.24-1.23 13.56 13.56 0 0 1 2.65-.26 13.78 13.78 0 0 1 7.82 2.08.62.62 0 0 1 .18.87zm1.22-2.73a.78.78 0 0 1-1.07.26 15.65 15.65 0 0 0-8.91-2.39 15.34 15.34 0 0 0-3-.3.78.78 0 0 1-.3-1.53 16.9 16.9 0 0 1 3.3-.33 17.2 17.2 0 0 1 9.78 2.62.78.78 0 0 1 .2 1.07zm.12-2.83a18.78 18.78 0 0 0-10.74-2.89 18.42 18.42 0 0 0-3.61.35.94.94 0 0 1-.36-1.84 20.3 20.3 0 0 1 4-.39 20.66 20.66 0 0 1 11.8 3.18.94.94 0 1 1-1.09 1.59z" />
    </svg>
  );
}

export function SnapchatIcon({ size = 16, className = '', ...props }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M12.001 2c-3.11 0-5.467 2.37-5.467 5.51 0 .68.14 1.34.42 1.95-.59.18-1.2.3-1.8.38-.45.06-.66.29-.62.62.06.42.4.67.88.75 1.13.18 1.83.69 2.09 1.53.07.24.08.5.03.74-.15.68-.69 1.15-1.57 1.37-.48.12-.76.36-.78.76-.02.42.23.69.69.83.84.26 1.7.53 2.54.83.47.17.84.44.97.94.25.96.95 1.58 2.02 1.81.42.09.85.12 1.28.14.3.01.6-.02.89-.09.97-.24 1.62-.84 1.86-1.78.13-.5.49-.78.96-.94.84-.29 1.7-.56 2.54-.82.46-.14.71-.41.69-.83-.02-.4-.3-.64-.78-.76-.88-.22-1.42-.69-1.57-1.37-.05-.24-.04-.5.03-.74.26-.84.96-1.35 2.09-1.53.48-.08.82-.33.88-.75.04-.33-.17-.56-.62-.62-.6-.08-1.21-.2-1.8-.38.28-.61.42-1.27.42-1.95C17.468 4.37 15.111 2 12.001 2z" />
    </svg>
  );
}

export function SocialIcon({ platform, size = 16, className = '' }: { platform: string; size?: number; className?: string }) {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <InstagramIcon size={size} className={className} />;
    case 'tiktok':
      return <TikTokIcon size={size} className={className} />;
    case 'x':
      return <XIcon size={size} className={className} />;
    case 'youtube':
      return <YoutubeIcon size={size} className={className} />;
    case 'facebook':
      return <FacebookIcon size={size} className={className} />;
    case 'linkedin':
      return <LinkedinIcon size={size} className={className} />;
    case 'github':
      return <GithubIcon size={size} className={className} />;
    case 'telegram':
      return <TelegramIcon size={size} className={className} />;
    case 'spotify':
      return <SpotifyIcon size={size} className={className} />;
    case 'snapchat':
      return <SnapchatIcon size={size} className={className} />;
    default:
      return <Globe size={size} className={className} />;
  }
}
