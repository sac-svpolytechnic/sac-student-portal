import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Session } from '@/lib/types';

export const SEED_SESSIONS: Session[] = [];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get('club_id');
    const sessionId = searchParams.get('session_id');

    let query = supabase
      .from('sessions')
      .select('*, clubs(*)')
      .order('start_time', { ascending: false });

    if (clubId) query = query.eq('club_id', clubId);
    if (sessionId) query = query.eq('id', sessionId);

    const { data: sessions, error } = await query;

    if (error || !sessions || sessions.length === 0) {
      if (sessionId) {
        const found = SEED_SESSIONS.find((s) => s.id === sessionId);
        return NextResponse.json({ session: found || null });
      }
      return NextResponse.json({
        sessions: clubId ? SEED_SESSIONS.filter((s) => s.club_id === clubId) : SEED_SESSIONS,
        source: 'fallback',
      });
    }

    if (sessionId) {
      return NextResponse.json({ session: sessions[0] });
    }

    return NextResponse.json({ sessions, source: 'database' });
  } catch {
    return NextResponse.json({ sessions: SEED_SESSIONS, source: 'fallback' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      club_id,
      title,
      description,
      start_time,
      end_time,
      lat,
      lng,
      geofence_radius_m,
    } = body;

    if (!club_id || !title || !start_time || !end_time) {
      return NextResponse.json({ error: 'Missing required session parameters' }, { status: 400 });
    }

    // Generate random 32-byte session qr_secret
    const qrSecret = Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        club_id,
        title,
        description: description || '',
        start_time,
        end_time,
        lat: lat ? parseFloat(lat) : 28.7041,
        lng: lng ? parseFloat(lng) : 77.1025,
        geofence_radius_m: geofence_radius_m ? parseInt(geofence_radius_m, 10) : 100,
        qr_secret: qrSecret,
        status: 'ACTIVE',
        created_by: user.id,
      })
      .select('*, clubs(*)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ session, message: 'Session launched successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
