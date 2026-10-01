import { z } from 'zod';

export const RESERVED_USERNAMES = new Set([
  'admin',
  'login',
  'signup',
  'dashboard',
  'api',
  'help',
  'support',
  'settings',
  'pricing',
  'about',
  'terms',
  'privacy',
  'app',
  'www',
  'bionest',
  'go',
  'onboarding',
  'reset-password',
  'report',
  'auth',
  'profile',
  'account',
  'explore',
  'analytics',
  'appearance',
]);

// 6.2 Username rule:
// 3 to 30 characters, lowercase letters, numbers, underscore and hyphen.
// Must start with a letter or number.
export const usernameRegex = /^[a-z0-9][a-z0-9_-]{2,29}$/;

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username cannot exceed 30 characters')
  .toLowerCase()
  .trim()
  .regex(
    usernameRegex,
    'Username can only contain lowercase letters, numbers, underscores, and hyphens, and must start with a letter or number'
  )
  .refine(
    (val) => !RESERVED_USERNAMES.has(val.toLowerCase()),
    'This username is reserved and cannot be claimed'
  );

// Safe URL validator - only allow http and https
export function isValidHttpUrl(urlStr: string): boolean {
  try {
    const trimmed = urlStr.trim();
    if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
      return false;
    }
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export const urlSchema = z
  .string()
  .trim()
  .refine(isValidHttpUrl, 'URL must start with http:// or https://');

// Clean and sanitize international phone numbers for WhatsApp / Tel
export function sanitizePhoneNumber(phone: string): string {
  // strip all non-digits except leading +
  const cleaned = phone.trim().replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    return cleaned.slice(1);
  }
  return cleaned;
}

export const linkTypeSchema = z.enum([
  'standard',
  'whatsapp',
  'phone',
  'email',
  'header',
]);

export type LinkType = z.infer<typeof linkTypeSchema>;

export const linkFormSchema = z
  .object({
    id: z.string().uuid().optional(),
    type: linkTypeSchema,
    title: z.string().trim().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
    url: z.string().optional().nullable(),
    whatsapp_number: z.string().optional().nullable(),
    message: z.string().max(500, 'Message cannot exceed 500 characters').optional().nullable(),
    position: z.number().int().default(0),
    is_active: z.boolean().default(true),
    show_from: z.string().optional().nullable(),
    show_until: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'standard') {
      if (!data.url || !isValidHttpUrl(data.url)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A valid http:// or https:// URL is required for standard links',
          path: ['url'],
        });
      }
    } else if (data.type === 'whatsapp') {
      const sanitized = data.whatsapp_number ? sanitizePhoneNumber(data.whatsapp_number) : '';
      if (!sanitized || sanitized.length < 7 || sanitized.length > 15) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Valid international phone number with country code is required (e.g. +2348012345678)',
          path: ['whatsapp_number'],
        });
      }
    } else if (data.type === 'phone') {
      const sanitized = data.url ? sanitizePhoneNumber(data.url) : '';
      if (!sanitized || sanitized.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Valid phone number is required (e.g. +2348012345678)',
          path: ['url'],
        });
      }
    } else if (data.type === 'email') {
      const email = (data.url || '').trim().replace(/^mailto:/i, '');
      const emailValid = z.string().email().safeParse(email).success;
      if (!emailValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Valid email address is required',
          path: ['url'],
        });
      }
    }

    // Schedule validation
    if (data.show_from && data.show_until) {
      const fromTime = new Date(data.show_from).getTime();
      const untilTime = new Date(data.show_until).getTime();
      if (!isNaN(fromTime) && !isNaN(untilTime) && untilTime <= fromTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date/time must be strictly after the start date/time',
          path: ['show_until'],
        });
      }
    }
  });

export const profileSchema = z.object({
  display_name: z.string().trim().max(50, 'Display name cannot exceed 50 characters').optional().nullable(),
  bio: z.string().trim().max(160, 'Bio cannot exceed 160 characters').optional().nullable(),
  avatar_url: z.string().optional().nullable(),
});

export const reportSchema = z.object({
  profile_id: z.string().uuid(),
  reason: z.enum([
    'spam_or_phishing',
    'impersonation',
    'inappropriate_content',
    'scam_or_fraud',
    'other',
  ]),
  details: z.string().trim().max(1000, 'Details cannot exceed 1000 characters').optional().nullable(),
});

export const socialPlatformList = [
  'instagram',
  'tiktok',
  'x',
  'youtube',
  'facebook',
  'linkedin',
  'snapchat',
  'telegram',
  'spotify',
  'github',
  'website',
] as const;

export type SocialPlatform = (typeof socialPlatformList)[number];

export function buildSocialUrl(platform: SocialPlatform, handleOrUrl: string): string {
  const trimmed = handleOrUrl.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const cleanHandle = trimmed.replace(/^@/, '');

  switch (platform) {
    case 'instagram':
      return `https://instagram.com/${cleanHandle}`;
    case 'tiktok':
      return `https://tiktok.com/@${cleanHandle}`;
    case 'x':
      return `https://x.com/${cleanHandle}`;
    case 'youtube':
      return `https://youtube.com/@${cleanHandle}`;
    case 'facebook':
      return `https://facebook.com/${cleanHandle}`;
    case 'linkedin':
      return `https://linkedin.com/in/${cleanHandle}`;
    case 'snapchat':
      return `https://snapchat.com/add/${cleanHandle}`;
    case 'telegram':
      return `https://t.me/${cleanHandle}`;
    case 'spotify':
      return cleanHandle.startsWith('user/') || cleanHandle.startsWith('artist/')
        ? `https://open.spotify.com/${cleanHandle}`
        : `https://open.spotify.com/user/${cleanHandle}`;
    case 'github':
      return `https://github.com/${cleanHandle}`;
    case 'website':
      return `https://${cleanHandle}`;
    default:
      return `https://${cleanHandle}`;
  }
}

// Function to check if a link is currently active by its schedule window
export function isLinkScheduledActive(
  is_active: boolean,
  show_from: string | null | undefined,
  show_until: string | null | undefined,
  currentDate: Date = new Date()
): boolean {
  if (!is_active) return false;
  const now = currentDate.getTime();

  if (show_from) {
    const fromTime = new Date(show_from).getTime();
    if (!isNaN(fromTime) && now < fromTime) {
      return false;
    }
  }

  if (show_until) {
    const untilTime = new Date(show_until).getTime();
    if (!isNaN(untilTime) && now > untilTime) {
      return false;
    }
  }

  return true;
}
