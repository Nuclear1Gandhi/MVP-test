import type { HTMLAttributes, ReactNode } from "react";

export type InlineMessageTone = "neutral" | "success" | "error";

export type InlineMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  tone?: InlineMessageTone;
  children?: ReactNode;
};

const toneClasses: Record<InlineMessageTone, string> = {
  neutral: "text-app-muted",
  success: "text-app-success",
  error: "text-app-error",
};

/** * Non-field status text (e.g. auth feedback). */
export function InlineMessage({
  tone = "error",
  className,
  children,
  role = "alert",
  ...props
}: InlineMessageProps) {
  if (children == null || children === "") return null;
  const base = "text-sm";
  return (
    <p
      role={role}
      className={[base, toneClasses[tone], className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </p>
  );
}
