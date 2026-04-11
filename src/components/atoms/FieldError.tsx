import type { HTMLAttributes, ReactNode } from "react";

export type FieldErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

/** * Accessible inline validation or form-level error text. */
export function FieldError({ children, className, id, ...props }: FieldErrorProps) {
  if (children == null || children === "") return null;
  const base = "text-sm text-app-error";
  return (
    <p
      id={id}
      role="alert"
      className={[base, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </p>
  );
}
