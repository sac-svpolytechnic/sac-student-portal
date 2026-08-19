import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SEED_CLUBS } from '@/lib/seed';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: clubs, error } = await supabase
      .from('clubs')
      .select('*, club_members(count)')
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false });

    if (error || !clubs || clubs.length === 0) {
      return NextResponse.json({
        clubs: SEED_CLUBS.map((c) => ({ ...c, member_count: 24 })),
        source: 'fallback',
      });
    }

    const formatted = clubs.map((c) => ({
      ...c,
      member_count: c.club_members?.[0]?.count ?? 0,
    }));

    return NextResponse.json({ clubs: formatted, source: 'database' });
  } catch {
    return NextResponse.json({
      clubs: SEED_CLUBS.map((c) => ({ ...c, member_count: 24 })),
      source: 'fallback',
    });
  }
}
