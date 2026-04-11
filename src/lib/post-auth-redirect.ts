import { isAdminEmail } from "@/lib/admin";

import { isSafeRelativeAppPath } from "@/lib/safe-app-path";

/**
 * * Picks the path after sign-in: explicit safe `next`, else /admin for allowlisted emails, else /submit.
 */
export function resolvePostAuthRedirectPath(
  email: string | undefined,
  nextParam: string | null,
): string {
  if (nextParam && isSafeRelativeAppPath(nextParam)) {
    return nextParam;
  }
  return isAdminEmail(email) ? "/admin" : "/submit";
}
