import { getSupabaseSecretKey, getSupabaseUrl } from "@/lib/supabase/env";
import { createClient } from "@supabase/supabase-js";

/**
 * * Server-only client using the secret API key (or legacy service_role JWT). Bypasses RLS.
 * ! Never import this module from Client Components; secret keys must not run in the browser.
 */
export function createServiceRoleClient() {
  return createClient(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
