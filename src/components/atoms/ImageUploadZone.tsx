"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { HelperText } from "./HelperText";
import { Label } from "./Label";

export type ImageUploadZoneProps = {
  /** * Field id; links the visible label to the hidden file input. */
  id: string;
  /** * Caption above the drop zone. */
  label: string;
  /** * `accept` string for the file input (e.g. MIME list). */
  accept: string;
  /** * Currently selected file, or null when cleared. */
  file: File | null;
  /** * Called when the user picks, drops, or clears the file. */
  onFileChange: (file: File | null) => void;
  /** * Muted line below the zone (formats and limits). */
  hint: string;
  /** * Smaller line inside the zone under the main prompt. */
  zoneSubtext: string;
  /** * Accessible name for the drop zone control. */
  ariaLabel?: string;
  /** * Reflects validation state for assistive tech. */
  "aria-invalid"?: boolean;
  /** * Element id(s) for `aria-describedby` on the file input (e.g. error message). */
  ariaDescribedBy?: string;
  className?: string;
} & Pick<InputHTMLAttributes<HTMLInputElement>, "name" | "disabled">;

/** * Hidden file input plus a keyboard- and drag-drop-friendly upload surface. */
export function ImageUploadZone({
  id,
  name,
  accept,
  label,
  file,
  onFileChange,
  hint,
  zoneSubtext,
  ariaLabel = "Upload image",
  "aria-invalid": ariaInvalid,
  ariaDescribedBy,
  disabled,
  className,
}: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!file && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [file]);

  const openPicker = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.files?.[0] ?? null;
      onFileChange(next);
    },
    [onFileChange],
  );

  const handleZoneKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPicker();
      }
    },
    [disabled, openPicker],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      onFileChange(dropped ?? null);
    },
    [disabled, onFileChange],
  );

  const zoneBase =
    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border-2 border-dashed border-app-border bg-app-surface-2 px-4 py-8 text-center text-sm text-app-text shadow-[var(--shadow-input)] transition-[border-color,background-color,box-shadow] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)]";
  const zoneInteractive =
    "hover:border-app-primary hover:bg-app-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]";
  const zoneDragging = "border-app-primary bg-app-primary-subtle";
  const zoneInvalid =
    "border-app-error shadow-[var(--shadow-input),var(--shadow-focus-error)]";
  const zoneDisabled = "cursor-not-allowed opacity-60";

  return (
    <div className={["space-y-1", className].filter(Boolean).join(" ")}>
      <Label htmlFor={id}>{label}</Label>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        disabled={disabled}
        tabIndex={-1}
        className="sr-only"
        onChange={handleInputChange}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
      />
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        className={[
          zoneBase,
          !disabled && zoneInteractive,
          isDragging && zoneDragging,
          ariaInvalid && zoneInvalid,
          disabled && zoneDisabled,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={openPicker}
        onKeyDown={handleZoneKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-app-muted" aria-hidden>
          <svg
            width={32}
            height={32}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M9 12l3-3 3 3M12 9v6" />
          </svg>
        </div>
        <p className="max-w-[20rem] text-app-text">
          Drop an image here, or{" "}
          <strong className="font-semibold text-[var(--color-primary)]">
            browse files
          </strong>
        </p>
        <p className="text-xs text-app-muted">{zoneSubtext}</p>
        {file ? (
          <p className="mt-1 max-w-full truncate text-xs font-medium text-app-text">
            {file.name}
          </p>
        ) : null}
      </div>
      <HelperText>{hint}</HelperText>
    </div>
  );
}
