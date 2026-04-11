import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

const fileClassName =
  "block w-full cursor-pointer text-sm text-app-muted file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-app-offset file:px-3 file:py-2 file:text-sm file:font-medium file:text-app-text file:shadow-sm file:transition-colors hover:file:bg-app-dynamic";

export type FileInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

/** * Styled file picker matching the design system. */
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  function FileInput({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        type="file"
        className={[fileClassName, className].filter(Boolean).join(" ")}
        {...props}
      />
    );
  },
);
