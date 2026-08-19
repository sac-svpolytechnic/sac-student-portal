import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const SEED_SESSIONS = [
  {
    id: 's1111111-1111-1111-1111-111111111111',
    club_id: 'c1111111-1111-1111-1111-111111111111',
    title: 'CodeCraft: Hands-on Next.js 15 & Realtime Workshop',
    description: 'Practical lab session covering Server Components, App Router architectures, and WebSocket streaming.',
    start_time: new Date(Date.now() - 30 * 60000).toISOString(),
    end_time: new Date(Date.now() + 90 * 60000).toISOString(),
    lat: 28.7041,
    lng: 77.1025,
    geofence_radius_m: 100,
    qr_secret: 'codecraft-super-secret-seed-key-32-chars-long',
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
  },
  {
    id: 's2222222-2222-2222-2222-222222222222',
    club_id: 'c2222222-2222-2222-2222-222222222222',
    title: 'Robotics Guild: Autonomous Rover Calibration',
    description: 'Testing obstacle-avoidance algorithms and motor drivers on the indoor test track.',
    start_time: new Date(Date.now() + 24 * 3600000).toISOString(),
    end_time: new Date(Date.now() + 26 * 3600000).toISOString(),
    lat: 28.7041,
    lng: 77.1025,
    geofence_radius_m: 150,
    qr_secret: 'robotics-super-secret-seed-key-32-chars-long',
    status: 'SCHEDULED',
    created_at: new Date().toISOString(),
  },
];

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
        return NextResponse.json({ session: found || SEED_SESSIONS[0] });
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
