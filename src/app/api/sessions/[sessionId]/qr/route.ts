import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateQRToken } from '@/lib/qr/token';
import { generateQRCodeDataURL } from '@/lib/qr/generate';
import { SEED_SESSIONS } from '@/app/api/sessions/route';

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ sessionId: string }> }
) {
  const params = await props.params;
  const { sessionId } = params;

  try {
    const supabase = await createClient();
    let session = null;

    const { data } = await supabase
      .from('sessions')
      .select('*, clubs(*)')
      .eq('id', sessionId)
      .maybeSingle();

    if (data) {
      session = data;
    } else {
      session = SEED_SESSIONS.find((s) => s.id === sessionId) || SEED_SESSIONS[0];
    }

    // Generate short-lived rotating JWT token (20 seconds validity)
    const nonce = Math.random().toString(36).substring(2, 12);
    const token = await generateQRToken(
      {
        sessionId: session.id,
        clubId: session.club_id,
        nonce,
        timestamp: Date.now(),
      },
      session.qr_secret,
      20 // 20s rotation
    );

    // Generate QR Code Data URL
    const qrDataUrl = await generateQRCodeDataURL(token, {
      width: 400,
      margin: 2,
    });

    return NextResponse.json({
      token,
      qrDataUrl,
      expiresInSeconds: 20,
      timestamp: Date.now(),
      session: {
        id: session.id,
        title: session.title,
        club_name: session.clubs?.name || 'SAC Student Activity',
        lat: session.lat,
        lng: session.lng,
        geofence_radius_m: session.geofence_radius_m,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to generate rotating QR';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
