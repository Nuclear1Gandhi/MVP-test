/**
 * * Admin allowlist from env (comma-separated emails, case-insensitive).
 */

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const list = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ?? [];
  return list.includes(email.trim().toLowerCase());
}
