/**
 * Compatibility shim for repositories upgraded from v0.8.x.
 * v0.9+ stores application data in Railway PostgreSQL and does not use Supabase.
 */
export function isSupabaseConfigured() {
  return false;
}

export function getSupabaseClient() {
  return null;
}
