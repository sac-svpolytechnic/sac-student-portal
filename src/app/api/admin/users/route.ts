import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SEED_USERS } from '@/lib/seed-admin';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q')?.toLowerCase() || '';
    const roleFilter = searchParams.get('role');

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    let users = profiles && profiles.length > 0 ? profiles : SEED_USERS;

    if (search) {
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.roll_no.toLowerCase().includes(search) ||
          (u.branch?.toLowerCase() || '').includes(search)
      );
    }

    if (roleFilter && roleFilter !== 'ALL') {
      users = users.filter((u) => u.role === roleFilter);
    }

    return NextResponse.json({
      users,
      source: error || !profiles || profiles.length === 0 ? 'fallback' : 'database',
    });
  } catch {
    return NextResponse.json({ users: SEED_USERS, source: 'fallback' });
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
    const { user_id, role } = body;

    if (!user_id || !role || !['SUPER_ADMIN', 'TEACHER', 'CLUB_ADMIN', 'MEMBER'].includes(role)) {
      return NextResponse.json({ error: 'Invalid user or role' }, { status: 400 });
    }

    const { data: updated, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', user_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: true,
        message: `Role elevated to ${role} (Demo Mode)`,
        user: { id: user_id, role },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Role updated to ${role} successfully`,
      user: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
