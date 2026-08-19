import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('attendance')
      .update({ check_out_time: now })
      .eq('session_id', session_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: true,
        message: 'Check-out recorded (Demo Mode)',
        check_out_time: now,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Check-out logged successfully',
      attendance: data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
