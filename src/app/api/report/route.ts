import { NextRequest, NextResponse } from 'next/server';
import { reportSchema } from '@/lib/validation';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = reportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid report payload' },
        { status: 400 }
      );
    }

    const { profile_id, reason, details } = validation.data;
    const supabase = createAdminClient();

    const { error } = await supabase.from('reports').insert({
      profile_id,
      reason,
      details: details || null,
    });

    if (error) {
      console.error('Failed to insert report:', error);
      return NextResponse.json(
        { error: 'Failed to record report. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Report submission error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
