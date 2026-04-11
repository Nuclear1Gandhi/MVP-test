import type { InputHTMLAttributes, ReactNode } from "react";

export type RadioFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  /** * Visible label next to the control. */
  label: ReactNode;
  /** * Optional class on the outer label wrapper. */
  labelClassName?: string;
};

/** * One radio option: accessible label + input row. */
export function RadioField({
  label,
  labelClassName,
  id,
  ...inputProps
}: RadioFieldProps) {
  const wrap =
    "flex cursor-pointer items-center gap-2 text-sm text-app-text";
  const labelProps =
    id != null && id !== "" ? { htmlFor: id as string } : {};
  const inputId = id != null && id !== "" ? { id: id as string } : {};
  return (
    <label {...labelProps} className={[wrap, labelClassName].filter(Boolean).join(" ")}>
      <input
        type="radio"
        className="h-4 w-4 accent-app-primary"
        {...inputId}
        {...inputProps}
      />
      {label}
    </label>
  );
}
