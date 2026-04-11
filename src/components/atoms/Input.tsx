import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

const inputClassName =
  "min-h-10 w-full rounded-md border border-app-border bg-app-surface-2 px-3 py-2 text-base text-app-text shadow-[var(--shadow-input)] outline-none transition-[border-color,box-shadow] duration-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-app-faint hover:border-[color-mix(in_oklch,var(--color-border)_60%,var(--color-text)_40%)] focus-visible:border-app-border focus-visible:shadow-[var(--shadow-input),var(--shadow-focus)] disabled:cursor-not-allowed disabled:bg-app-offset disabled:text-app-muted sm:text-sm aria-[invalid=true]:border-app-error aria-[invalid=true]:shadow-[var(--shadow-input),var(--shadow-focus-error)]";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/** * Single-line text-like inputs (text, email, password, etc.). */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={[inputClassName, className].filter(Boolean).join(" ")}
        {...props}
      />
    );
  },
);
