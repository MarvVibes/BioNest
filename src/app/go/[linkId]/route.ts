import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  isLinkScheduledActive,
  sanitizePhoneNumber,
} from '@/lib/validation';
import {
  mapReferrer,
  parseDevice,
  isBot,
  generateVisitorHash,
} from '@/lib/analytics-helpers';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ linkId: string }> }
) {
  const { linkId } = await context.params;

  if (!linkId) {
    return new NextResponse('Link ID is required', { status: 400 });
  }

  const supabase = createAdminClient();

  // 1. Fetch link by ID
  const { data: link, error: linkError } = await supabase
    .from('links')
    .select('*, profiles!inner(id, disabled)')
    .eq('id', linkId)
    .maybeSingle();

  if (linkError || !link) {
    return new NextResponse('Link not found', { status: 404 });
  }

  // 2. Verify profile is not disabled
  if (link.profiles?.disabled) {
    return new NextResponse('Page is currently unavailable', { status: 404 });
  }

  // 3. Verify link is active and within schedule window
  const isLive = isLinkScheduledActive(
    link.is_active,
    link.show_from,
    link.show_until
  );

  if (!isLive) {
    return new NextResponse('This link is currently inactive or expired', {
      status: 404,
    });
  }

  // 4. Determine destination URL
  let destinationUrl = link.url || '/';

  if (link.type === 'whatsapp') {
    const cleanNumber = sanitizePhoneNumber(link.whatsapp_number || '');
    const encodedMsg = link.message ? encodeURIComponent(link.message) : '';
    destinationUrl = `https://wa.me/${cleanNumber}${
      encodedMsg ? `?text=${encodedMsg}` : ''
    }`;
  } else if (link.type === 'phone') {
    const cleanNumber = sanitizePhoneNumber(link.url || '');
    destinationUrl = `tel:${cleanNumber}`;
  } else if (link.type === 'email') {
    const cleanEmail = (link.url || '').replace(/^mailto:/i, '');
    destinationUrl = `mailto:${cleanEmail}`;
  }

  // 5. Asynchronously record the click event
  // CRITICAL REQUIREMENT: Redirect MUST still happen even if recording the event fails!
  try {
    const userAgent = request.headers.get('user-agent') || '';

    // Filter out bots from polluting real analytics
    if (!isBot(userAgent)) {
      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        '127.0.0.1';

      const country =
        request.headers.get('x-vercel-ip-country') ||
        request.headers.get('cf-ipcountry') ||
        request.headers.get('x-country-code') ||
        null;

      const referrerHeader = request.headers.get('referer');
      const referrer = mapReferrer(referrerHeader);
      const device = parseDevice(userAgent);
      const visitorHash = generateVisitorHash(ip, userAgent, link.profile_id);

      // Fire and record event
      await supabase.from('events').insert({
        profile_id: link.profile_id,
        link_id: link.id,
        type: 'click',
        country,
        referrer,
        device,
        visitor_hash: visitorHash,
      });
    }
  } catch (err) {
    // Fail silently so visitor experience is uninterrupted
    console.error('Failed to log click event (safe fallback triggered):', err);
  }

  // 6. Return 302 Redirect
  return NextResponse.redirect(destinationUrl, 302);
}
