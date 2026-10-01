import { describe, it, expect } from 'vitest';
import {
  usernameSchema,
  isValidHttpUrl,
  sanitizePhoneNumber,
  RESERVED_USERNAMES,
  buildSocialUrl,
} from '../lib/validation';

describe('Username Validation', () => {
  it('accepts valid usernames', () => {
    const validUsernames = ['ada', 'ada_eze', 'john-doe123', 'creator99', 'tech_hub-01'];
    for (const name of validUsernames) {
      const res = usernameSchema.safeParse(name);
      expect(res.success, `Expected "${name}" to be valid`).toBe(true);
    }
  });

  it('rejects usernames that are too short or too long', () => {
    expect(usernameSchema.safeParse('ab').success).toBe(false); // < 3
    expect(usernameSchema.safeParse('a'.repeat(31)).success).toBe(false); // > 30
  });

  it('rejects usernames starting with special characters or containing invalid characters', () => {
    expect(usernameSchema.safeParse('_invalid').success).toBe(false);
    expect(usernameSchema.safeParse('-invalid').success).toBe(false);
    expect(usernameSchema.safeParse('has space').success).toBe(false);
    expect(usernameSchema.safeParse('user@name').success).toBe(false);
    expect(usernameSchema.safeParse('user.name').success).toBe(false);
  });

  it('rejects reserved system usernames', () => {
    for (const reserved of Array.from(RESERVED_USERNAMES)) {
      const res = usernameSchema.safeParse(reserved);
      expect(res.success, `Expected reserved name "${reserved}" to be rejected`).toBe(false);
    }
  });
});

describe('URL and Scheme Security Validation', () => {
  it('allows safe http and https URLs', () => {
    expect(isValidHttpUrl('https://instagram.com/myname')).toBe(true);
    expect(isValidHttpUrl('http://mywebsite.ng')).toBe(true);
    expect(isValidHttpUrl('https://store.example.com/item/42?ref=bio')).toBe(true);
  });

  it('strictly rejects malicious schemes like javascript:, data:, vbscript:', () => {
    expect(isValidHttpUrl('javascript:alert(1)')).toBe(false);
    expect(isValidHttpUrl('javascript:void(0)')).toBe(false);
    expect(isValidHttpUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isValidHttpUrl('vbscript:msgbox("test")')).toBe(false);
    expect(isValidHttpUrl('file:///etc/passwd')).toBe(false);
    expect(isValidHttpUrl('not-a-valid-url')).toBe(false);
    expect(isValidHttpUrl('')).toBe(false);
  });
});

describe('Phone Number Sanitization', () => {
  it('cleans international phone numbers properly', () => {
    expect(sanitizePhoneNumber('+234 801 234 5678')).toBe('2348012345678');
    expect(sanitizePhoneNumber('234-802-333-4444')).toBe('2348023334444');
    expect(sanitizePhoneNumber('+(234) 803 111 2222')).toBe('2348031112222');
  });
});

describe('Social URL Builder', () => {
  it('generates correct destination URLs for handles and direct links', () => {
    expect(buildSocialUrl('instagram', 'adaeze')).toBe('https://instagram.com/adaeze');
    expect(buildSocialUrl('instagram', '@adaeze')).toBe('https://instagram.com/adaeze');
    expect(buildSocialUrl('tiktok', 'afrobeats')).toBe('https://tiktok.com/@afrobeats');
    expect(buildSocialUrl('x', 'tech_africa')).toBe('https://x.com/tech_africa');
    expect(buildSocialUrl('youtube', 'lagoscoder')).toBe('https://youtube.com/@lagoscoder');
    expect(buildSocialUrl('website', 'https://portfolio.me')).toBe('https://portfolio.me');
  });
});
