import crypto from 'crypto';

export type ReferrerSource =
  | 'Instagram'
  | 'TikTok'
  | 'WhatsApp'
  | 'X'
  | 'Facebook'
  | 'YouTube'
  | 'Direct'
  | 'Other';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// 6.8 & 7 Referrer mapping: Map the Referer header to standard channels
export function mapReferrer(referrerHeader: string | null | undefined): ReferrerSource {
  if (!referrerHeader || referrerHeader.trim() === '') {
    return 'Direct';
  }

  try {
    const url = new URL(referrerHeader);
    const host = url.hostname.toLowerCase();

    if (host.includes('instagram.com') || host.includes('l.instagram.com')) {
      return 'Instagram';
    }
    if (host.includes('tiktok.com') || host.includes('byteoversea.com')) {
      return 'TikTok';
    }
    if (host.includes('whatsapp.com') || host.includes('wa.me') || host.includes('chat.whatsapp.com')) {
      return 'WhatsApp';
    }
    if (
      host.includes('t.co') ||
      host.includes('twitter.com') ||
      host.includes('x.com') ||
      host.includes('mobile.twitter.com')
    ) {
      return 'X';
    }
    if (
      host.includes('facebook.com') ||
      host.includes('fb.me') ||
      host.includes('l.facebook.com') ||
      host.includes('m.facebook.com')
    ) {
      return 'Facebook';
    }
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      return 'YouTube';
    }

    // Direct / internal
    if (host.includes('bionest.link') || host.includes('localhost')) {
      return 'Direct';
    }

    return 'Other';
  } catch {
    return 'Direct';
  }
}

// 6.8 & 7 Device parsing: parse User-Agent into mobile, tablet, desktop
export function parseDevice(userAgent: string | null | undefined): DeviceType {
  if (!userAgent) return 'desktop';
  const ua = userAgent.toLowerCase();

  if (/ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk/i.test(ua)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

// 6.8 & 7 Bot / Crawler Filtering
const BOT_PATTERNS = [
  'googlebot',
  'bingbot',
  'yandexbot',
  'duckduckbot',
  'baiduspider',
  'twitterbot',
  'facebookexternalhit',
  'linkedinbot',
  'slackbot',
  'telegrambot',
  'whatsapp',
  'discordbot',
  'applebot',
  'pinterestbot',
  'redditbot',
  'semrushbot',
  'ahrefsbot',
  'dotbot',
  'rogerbot',
  'exabot',
  'mj12bot',
  'ia_archiver',
  'crawler',
  'spider',
  'headlesschrome',
  'bot',
  'uptimerobot',
  'curl',
  'wget',
  'python-requests',
];

export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some((pattern) => ua.includes(pattern));
}

// 6.8 & 7 Visitor Hash: SHA-256 of (IP + User-Agent + daily rotating salt + profile_id).
// Never stores raw IP. Rotates daily.
export function generateVisitorHash(
  ip: string,
  userAgent: string,
  profileId: string,
  date: Date = new Date()
): string {
  // Daily rotating salt based on YYYY-MM-DD
  const dateStr = date.toISOString().split('T')[0];
  const salt = process.env.VISITOR_SALT || 'bionest-daily-salt-entropy';
  const payload = `${ip}:${userAgent}:${dateStr}:${salt}:${profileId}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}
