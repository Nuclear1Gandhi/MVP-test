import type { LabelHTMLAttributes } from "react";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

/** * Form field caption matching app typography. */
export function Label({ className, ...props }: LabelProps) {
  const base = "text-sm font-medium text-app-text";
  return (
    <label
      className={[base, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
