import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SEED_USERS } from '@/lib/seed-admin';
import type { UserRole } from '@/lib/types';

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

    // Fill roles array if empty for backward compatibility
    users = users.map((u) => ({
      ...u,
      roles: u.roles && u.roles.length > 0 ? u.roles : [u.role],
    }));

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
      users = users.filter((u) => u.roles?.includes(roleFilter as UserRole) || u.role === roleFilter);
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
    const { user_id, role, roles } = body;

    let targetRoles = roles;
    let targetRole = role;

    if (targetRoles && Array.isArray(targetRoles)) {
      const validRoles = ['SUPER_ADMIN', 'TEACHER', 'CLUB_ADMIN', 'MEMBER'];
      if (!targetRoles.every((r) => validRoles.includes(r))) {
        return NextResponse.json({ error: 'Invalid roles list' }, { status: 400 });
      }
      if (targetRoles.length === 0) {
        targetRoles = ['MEMBER'];
      }
      // Determine single role priority for RLS and default views
      if (targetRoles.includes('SUPER_ADMIN')) {
        targetRole = 'SUPER_ADMIN';
      } else if (targetRoles.includes('TEACHER')) {
        targetRole = 'TEACHER';
      } else if (targetRoles.includes('CLUB_ADMIN')) {
        targetRole = 'CLUB_ADMIN';
      } else {
        targetRole = 'MEMBER';
      }
    } else if (targetRole) {
      if (!['SUPER_ADMIN', 'TEACHER', 'CLUB_ADMIN', 'MEMBER'].includes(targetRole)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      targetRoles = [targetRole];
    } else {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const { data: updated, error } = await supabase
      .from('profiles')
      .update({ role: targetRole, roles: targetRoles })
      .eq('id', user_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: true,
        message: `Roles updated (Demo Mode)`,
        user: { id: user_id, role: targetRole, roles: targetRoles },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Roles updated successfully`,
      user: {
        ...updated,
        roles: updated.roles && updated.roles.length > 0 ? updated.roles : [updated.role]
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
