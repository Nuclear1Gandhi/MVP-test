import { buttonClassName, type ButtonSize, type ButtonVariant } from "./buttonClassName";
import type { ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** * Visual style preset. */
  variant?: ButtonVariant;
  /** * Horizontal padding and height tier. */
  size?: ButtonSize;
};

/** * Primary, outline, and ghost buttons with shared design tokens. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  );
}
