/**
 * * Allows only same-origin app paths (blocks protocol-relative and external URLs).
 */
export function isSafeRelativeAppPath(path: string): boolean {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return false;
  }
  if (path.includes("://") || path.includes("\\")) {
    return false;
  }
  if (path === "/") {
    return true;
  }
  const prefixes = ["/submit", "/admin", "/login"] as const;
  return prefixes.some((p) => path === p || path.startsWith(`${p}/`));
}
