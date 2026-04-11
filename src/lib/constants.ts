/**
 * * Shared submission domain constants aligned with the Supabase CHECK constraints.
 */

export const SUBMISSION_TYPES = [
  { value: "retailer_receipt", label: "Retailer receipt" },
  { value: "serial_plate", label: "Serial / ID plate photo" },
] as const;

export type SubmissionTypeValue = (typeof SUBMISSION_TYPES)[number]["value"];

export const SUBMISSION_TYPE_VALUES: SubmissionTypeValue[] = [
  "retailer_receipt",
  "serial_plate",
];

/** * Maximum uploaded image size in bytes (5 MiB). */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** * Allowed image MIME types for uploads. */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** * Identifier field bounds. */
export const IDENTIFIER_MIN_LENGTH = 1;
export const IDENTIFIER_MAX_LENGTH = 200;

export const STORAGE_BUCKET = "submission-images";
