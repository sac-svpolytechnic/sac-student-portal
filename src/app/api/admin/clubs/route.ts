import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SEED_CLUBS } from '@/lib/seed';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: clubs, error } = await supabase
      .from('clubs')
      .select('*, club_members(*, profiles(*))')
      .order('created_at', { ascending: false });

    if (error || !clubs || clubs.length === 0) {
      return NextResponse.json({
        clubs: SEED_CLUBS.map((c) => ({
          ...c,
          member_count: 24,
          leads: [{ name: 'Assigned Lead', email: 'lead@svpoly.edu.in' }],
        })),
        source: 'fallback',
      });
    }

    return NextResponse.json({ clubs, source: 'database' });
  } catch {
    return NextResponse.json({ clubs: SEED_CLUBS, source: 'fallback' });
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
    const { name, description, branch_tags } = body;

    if (!name) {
      return NextResponse.json({ error: 'Club name is required' }, { status: 400 });
    }

    const { data: club, error } = await supabase
      .from('clubs')
      .insert({
        name,
        description: description || '',
        branch_tags: branch_tags || ['All Branches'],
        status: 'ACTIVE',
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: true,
        message: 'Club registered (Demo Mode)',
        club: {
          id: `c-demo-${Date.now()}`,
          name,
          description,
          branch_tags,
          status: 'ACTIVE',
          created_at: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ success: true, club, message: 'Club created successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { club_id, status } = body;

    if (!club_id || !status || !['ACTIVE', 'ARCHIVED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { data: club, error } = await supabase
      .from('clubs')
      .update({ status })
      .eq('id', club_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: true,
        message: `Club status set to ${status} (Demo Mode)`,
        club: { id: club_id, status },
      });
    }

    return NextResponse.json({ success: true, club });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
