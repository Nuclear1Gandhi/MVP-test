import type { HTMLAttributes } from "react";

export type HelperTextProps = HTMLAttributes<HTMLParagraphElement>;

/** * Muted hint below a field (constraints, format). */
export function HelperText({ className, ...props }: HelperTextProps) {
  const base = "text-xs text-app-muted";
  return (
    <p className={[base, className].filter(Boolean).join(" ")} {...props} />
  );
}
