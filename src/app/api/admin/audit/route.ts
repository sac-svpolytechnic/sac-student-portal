import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SEED_AUDIT_LOGS } from '@/lib/seed-admin';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const actionFilter = searchParams.get('action');

    const { data: logs, error } = await supabase
      .from('audit_logs')
      .select('*, profiles(name, email)')
      .order('created_at', { ascending: false });

    let entries =
      logs && logs.length > 0
        ? logs.map((l) => ({
            id: l.id,
            actor_name: l.profiles?.name || 'SAC Administrator',
            actor_email: l.profiles?.email || 'admin@svpoly.edu.in',
            action: l.action,
            target_type: l.target_type,
            target_name: l.metadata?.target_name || l.target_id || 'System Record',
            metadata: l.metadata || {},
            created_at: l.created_at,
          }))
        : SEED_AUDIT_LOGS;

    if (actionFilter && actionFilter !== 'ALL') {
      entries = entries.filter((e) => e.action === actionFilter);
    }

    return NextResponse.json({
      logs: entries,
      source: error || !logs || logs.length === 0 ? 'fallback' : 'database',
    });
  } catch {
    return NextResponse.json({ logs: SEED_AUDIT_LOGS, source: 'fallback' });
  }
}
