/** * Shared class strings for `<button>` and `<Link>` that should look like buttons. */
export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "cursor-pointer rounded-md border border-app-primary bg-app-primary font-medium text-app-inverse shadow-sm transition-[background-color,color,border-color,box-shadow] duration-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-app-primary-hover hover:bg-app-primary-hover disabled:cursor-not-allowed disabled:opacity-40",
  outline:
    "cursor-pointer rounded-md border border-app-border bg-app-offset font-medium text-app-text transition-[background-color,color,border-color] duration-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-app-dynamic disabled:cursor-not-allowed disabled:opacity-40",
  ghost:
    "cursor-pointer rounded-md border border-transparent font-medium text-app-muted transition-[background-color,color] duration-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-app-offset hover:text-app-text disabled:cursor-not-allowed disabled:opacity-40",
};

/**
 * Returns Tailwind classes for a button-styled control (native button or Next.js Link).
 */
export function buttonClassName(options?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}): string {
  const variant = options?.variant ?? "primary";
  const size = options?.size ?? "md";
  const extra = options?.className?.trim() ?? "";
  const sizePart = variant === "ghost" ? "text-sm" : sizeClasses[size];
  return [sizePart, variantClasses[variant], extra].filter(Boolean).join(" ");
}
