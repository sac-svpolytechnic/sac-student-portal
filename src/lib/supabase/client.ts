import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a minimal mock during build/SSG when env vars are unavailable
    console.warn('[Supabase] Missing env vars — client will not function');
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
