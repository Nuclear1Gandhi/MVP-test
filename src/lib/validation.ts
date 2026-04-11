import {
  ALLOWED_IMAGE_TYPES,
  IDENTIFIER_MAX_LENGTH,
  IDENTIFIER_MIN_LENGTH,
  MAX_IMAGE_BYTES,
  SUBMISSION_TYPE_VALUES,
  type SubmissionTypeValue,
} from "@/lib/constants";

export type FieldErrors = Partial<
  Record<"identifier" | "submission_type" | "image" | "form", string>
>;

/** * Validates identifier text for submissions. */
export function validateIdentifier(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.length < IDENTIFIER_MIN_LENGTH) {
    return "Identifier is required.";
  }
  if (trimmed.length > IDENTIFIER_MAX_LENGTH) {
    return `Identifier must be at most ${IDENTIFIER_MAX_LENGTH} characters.`;
  }
  return null;
}

/** * Validates submission type against allowed values. */
export function validateSubmissionType(
  raw: string,
): SubmissionTypeValue | null {
  if (!SUBMISSION_TYPE_VALUES.includes(raw as SubmissionTypeValue)) {
    return null;
  }
  return raw as SubmissionTypeValue;
}

/** * Validates a File for type and size (client or server with File from form). */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return "Image must be JPEG, PNG, or WebP.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image must be 5 MB or smaller.";
  }
  if (file.size === 0) {
    return "Image file is empty.";
  }
  return null;
}

/** * Ensures a storage path belongs to the given user (prefix guard). */
export function isImagePathForUser(path: string, userId: string): boolean {
  const prefix = `${userId}/`;
  return path.startsWith(prefix) && !path.includes("..");
}
