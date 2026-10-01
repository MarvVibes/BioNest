import { describe, it, expect } from 'vitest';
import {
  mapReferrer,
  parseDevice,
  isBot,
  generateVisitorHash,
} from '../lib/analytics-helpers';

describe('Referrer Source Mapping', () => {
  it('correctly maps known social platforms and in-app referrers', () => {
    expect(mapReferrer('https://l.instagram.com/')).toBe('Instagram');
    expect(mapReferrer('https://www.tiktok.com/@creator')).toBe('TikTok');
    expect(mapReferrer('https://t.co/xyz123')).toBe('X');
    expect(mapReferrer('https://twitter.com/i/flow/login')).toBe('X');
    expect(mapReferrer('https://x.com/adaeze')).toBe('X');
    expect(mapReferrer('https://web.whatsapp.com/')).toBe('WhatsApp');
    expect(mapReferrer('https://chat.whatsapp.com/invitation')).toBe('WhatsApp');
    expect(mapReferrer('https://l.facebook.com/l.php?u=...')).toBe('Facebook');
    expect(mapReferrer('https://www.youtube.com/watch?v=123')).toBe('YouTube');
    expect(mapReferrer('https://youtu.be/123')).toBe('YouTube');
  });

  it('maps missing, internal or empty referrers to Direct', () => {
    expect(mapReferrer('')).toBe('Direct');
    expect(mapReferrer(null)).toBe('Direct');
    expect(mapReferrer(undefined)).toBe('Direct');
    expect(mapReferrer('http://localhost:3000/ada')).toBe('Direct');
    expect(mapReferrer('https://bionest.link/ada')).toBe('Direct');
  });

  it('maps other external domains to Other', () => {
    expect(mapReferrer('https://techcabal.com/article/1')).toBe('Other');
    expect(mapReferrer('https://medium.com/@writer/post')).toBe('Other');
  });
});

describe('Device Classification', () => {
  it('detects mobile devices', () => {
    const iphoneUA =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
    const androidUA =
      'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
    expect(parseDevice(iphoneUA)).toBe('mobile');
    expect(parseDevice(androidUA)).toBe('mobile');
  });

  it('detects tablet devices', () => {
    const ipadUA =
      'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
    const androidTabletUA =
      'Mozilla/5.0 (Linux; Android 13; SM-X900) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';
    expect(parseDevice(ipadUA)).toBe('tablet');
    expect(parseDevice(androidTabletUA)).toBe('tablet');
  });

  it('detects desktop devices', () => {
    const macUA =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const windowsUA =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    expect(parseDevice(macUA)).toBe('desktop');
    expect(parseDevice(windowsUA)).toBe('desktop');
    expect(parseDevice(null)).toBe('desktop');
  });
});

describe('Bot & Crawler Filtering', () => {
  it('identifies automated search crawlers and link previewers', () => {
    expect(
      isBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')
    ).toBe(true);
    expect(isBot('facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)')).toBe(
      true
    );
    expect(isBot('Twitterbot/1.0')).toBe(true);
    expect(isBot('WhatsApp/2.21.12.21 A')).toBe(true);
    expect(isBot('Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)')).toBe(true);
    expect(isBot('TelegramBot (like TwitterBot)')).toBe(true);
    expect(isBot('curl/7.88.1')).toBe(true);
  });

  it('passes authentic human user agents', () => {
    const humanChrome =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    const humanSafari =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1';
    expect(isBot(humanChrome)).toBe(false);
    expect(isBot(humanSafari)).toBe(false);
  });
});

describe('Visitor Hash Anonymization (SHA-256)', () => {
  const profileId = 'd3b07384-d113-46d4-82a1-123456789abc';
  const ip = '102.89.43.12';
  const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)';
  const day1 = new Date('2026-10-01T10:00:00Z');
  const day2 = new Date('2026-10-02T10:00:00Z');

  it('generates a valid 64-character hex SHA-256 hash', () => {
    const hash = generateVisitorHash(ip, ua, profileId, day1);
    expect(hash).toHaveLength(64);
    expect(/^[a-f0-9]{64}$/.test(hash)).toBe(true);
  });

  it('produces the same hash for the same visitor on the same day for a profile', () => {
    const hashA = generateVisitorHash(ip, ua, profileId, day1);
    const hashB = generateVisitorHash(ip, ua, profileId, new Date('2026-10-01T23:59:59Z'));
    expect(hashA).toBe(hashB);
  });

  it('rotates hash on the next day for privacy (daily rotating anonymous hash)', () => {
    const hashDay1 = generateVisitorHash(ip, ua, profileId, day1);
    const hashDay2 = generateVisitorHash(ip, ua, profileId, day2);
    expect(hashDay1).not.toBe(hashDay2);
  });

  it('isolates hashes between different profiles for privacy', () => {
    const otherProfileId = 'e4c18495-e224-57e5-93b2-987654321def';
    const hash1 = generateVisitorHash(ip, ua, profileId, day1);
    const hash2 = generateVisitorHash(ip, ua, otherProfileId, day1);
    expect(hash1).not.toBe(hash2);
  });
});
