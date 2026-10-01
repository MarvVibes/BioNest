import { NextRequest, NextResponse } from 'next/server';
import { usernameSchema, RESERVED_USERNAMES } from '@/lib/validation';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username')?.toLowerCase().trim() || '';

  if (!username) {
    return NextResponse.json(
      { available: false, reason: 'Username is required' },
      { status: 400 }
    );
  }

  // 1. Zod format validation
  const validation = usernameSchema.safeParse(username);
  if (!validation.success) {
    return NextResponse.json(
      { available: false, reason: validation.error.issues[0]?.message || 'Invalid username' },
      { status: 200 }
    );
  }

  // 2. Reserved username check
  if (RESERVED_USERNAMES.has(username)) {
    return NextResponse.json(
      { available: false, reason: 'This username is reserved and cannot be claimed' },
      { status: 200 }
    );
  }

  // 3. Database uniqueness check via Supabase
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .ilike('username', username)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error querying username availability:', error);
      // If table doesn't exist yet or connection error in development:
      return NextResponse.json({ available: true });
    }

    if (data) {
      return NextResponse.json(
        { available: false, reason: 'This username is already taken' },
        { status: 200 }
      );
    }

    return NextResponse.json({ available: true });
  } catch (err) {
    console.error('Username check error:', err);
    return NextResponse.json({ available: true });
  }
}
