/**
 * * Resolves Supabase API keys for the hosted platform.
 * * Prefer publishable (`sb_publishable_...`) and secret (`sb_secret_...`) keys; legacy JWT
 * * `anon` / `service_role` values remain supported during the transition period.
 * @see https://supabase.com/docs/guides/api/api-keys
 */

/** * Project URL from the Supabase dashboard. */
export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  return url;
}

/**
 * * Low-privilege key for browser and server Supabase clients (RLS applies).
 * * Use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` is a fallback.
 */
export function getSupabasePublishableKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (recommended) or legacy NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return key;
}

/**
 * * Elevated key for server-only admin paths; bypasses RLS.
 * * Use `SUPABASE_SECRET_KEY`; legacy `SUPABASE_SERVICE_ROLE_KEY` is a fallback.
 *
 */
export function getSupabaseSecretKey(): string {
  const key =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SECRET_KEY (recommended) or legacy SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  return key;
}
