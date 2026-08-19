import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get('club_id');

    if (clubId) {
      // Fetch members of a specific club (leads/admins)
      const { data: members, error } = await supabase
        .from('club_members')
        .select('*, profiles(*)')
        .eq('club_id', clubId)
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ members: [] });
      }
      return NextResponse.json({ members });
    }

    // Fetch memberships of the current user
    const { data: memberships, error } = await supabase
      .from('club_members')
      .select('*, clubs(*)')
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ memberships: [] });
    }
    return NextResponse.json({ memberships });
  } catch {
    return NextResponse.json({ memberships: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Please sign in to join clubs' }, { status: 401 });
    }

    const body = await request.json();
    const { club_id } = body;

    if (!club_id) {
      return NextResponse.json({ error: 'Club ID is required' }, { status: 400 });
    }

    // Check if membership record already exists
    const { data: existing } = await supabase
      .from('club_members')
      .select('id, status, role')
      .eq('club_id', club_id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      if (existing.status === 'ACCEPTED') {
        return NextResponse.json({ error: 'You are already a member of this club' }, { status: 400 });
      }
      if (existing.status === 'PENDING') {
        return NextResponse.json({ error: 'Your membership request is already pending review' }, { status: 400 });
      }
      // If rejected, allow re-applying by updating to PENDING
      const { data: updated, error: updateErr } = await supabase
        .from('club_members')
        .update({ status: 'PENDING' })
        .eq('id', existing.id)
        .select()
        .single();

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }
      return NextResponse.json({ member: updated, message: 'Membership request re-submitted' });
    }

    // Create new pending membership
    const { data: member, error } = await supabase
      .from('club_members')
      .insert({
        club_id,
        user_id: user.id,
        role: 'MEMBER',
        status: 'PENDING',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ member, message: 'Membership request submitted successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
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
    const { membership_id, action, role } = body;

    if (!membership_id || !action || !['ACCEPT', 'REJECT', 'PROMOTE'].includes(action)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    let updateData: Record<string, unknown> = {};

    if (action === 'ACCEPT') {
      updateData = {
        status: 'ACCEPTED',
        joined_at: new Date().toISOString(),
      };
    } else if (action === 'REJECT') {
      updateData = {
        status: 'REJECTED',
      };
    } else if (action === 'PROMOTE') {
      if (!role || !['LEAD', 'CO_LEAD', 'MEMBER'].includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      updateData = { role };
    }

    const { data: updated, error } = await supabase
      .from('club_members')
      .update(updateData)
      .eq('id', membership_id)
      .select('*, profiles(*)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ member: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
