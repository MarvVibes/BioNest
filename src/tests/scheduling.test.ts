import { describe, it, expect } from 'vitest';
import { isLinkScheduledActive } from '../lib/validation';

describe('Link Scheduling Logic', () => {
  const baseTime = new Date('2026-10-01T12:00:00Z');

  it('returns false if link is toggled off (is_active = false) regardless of dates', () => {
    expect(isLinkScheduledActive(false, null, null, baseTime)).toBe(false);
    expect(
      isLinkScheduledActive(
        false,
        '2026-10-01T00:00:00Z',
        '2026-10-02T00:00:00Z',
        baseTime
      )
    ).toBe(false);
  });

  it('returns true if link has no schedule constraints (always active)', () => {
    expect(isLinkScheduledActive(true, null, null, baseTime)).toBe(true);
    expect(isLinkScheduledActive(true, undefined, undefined, baseTime)).toBe(true);
  });

  it('returns false if current time is before show_from', () => {
    const futureFrom = '2026-10-01T14:00:00Z'; // 2 hours in the future
    expect(isLinkScheduledActive(true, futureFrom, null, baseTime)).toBe(false);
  });

  it('returns true if current time is after show_from and no show_until', () => {
    const pastFrom = '2026-10-01T10:00:00Z'; // 2 hours in the past
    expect(isLinkScheduledActive(true, pastFrom, null, baseTime)).toBe(true);
  });

  it('returns false if current time is after show_until (expired)', () => {
    const pastUntil = '2026-10-01T11:00:00Z'; // 1 hour ago
    expect(isLinkScheduledActive(true, null, pastUntil, baseTime)).toBe(false);
  });

  it('returns true if current time is within active show_from and show_until window', () => {
    const from = '2026-10-01T09:00:00Z';
    const until = '2026-10-01T18:00:00Z';
    expect(isLinkScheduledActive(true, from, until, baseTime)).toBe(true);
  });

  it('returns false if current time is outside window (already ended)', () => {
    const from = '2026-09-20T00:00:00Z';
    const until = '2026-09-30T23:59:59Z';
    expect(isLinkScheduledActive(true, from, until, baseTime)).toBe(false);
  });
});
