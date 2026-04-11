"use server";

import { createClient } from "@/lib/supabase/server";
import type { SubmissionTypeValue } from "@/lib/constants";
import {
  isImagePathForUser,
  validateIdentifier,
  validateSubmissionType,
} from "@/lib/validation";

export type CreateSubmissionResult =
  | { ok: true }
  | { ok: false; error: string; field?: "identifier" | "submission_type" | "image_path" };

/** * Inserts a submission row after the image was uploaded to Storage (RLS applies). */
export async function createSubmission(input: {
  identifier: string;
  submission_type: string;
  image_path: string;
}): Promise<CreateSubmissionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in to submit." };
  }

  const idErr = validateIdentifier(input.identifier);
  if (idErr) {
    return { ok: false, error: idErr, field: "identifier" };
  }

  const type = validateSubmissionType(input.submission_type);
  if (!type) {
    return {
      ok: false,
      error: "Choose a valid submission type.",
      field: "submission_type",
    };
  }

  if (!isImagePathForUser(input.image_path, user.id)) {
    return {
      ok: false,
      error: "Invalid image path.",
      field: "image_path",
    };
  }

  const { error } = await supabase.from("submissions").insert({
    user_id: user.id,
    identifier: input.identifier.trim(),
    submission_type: type as SubmissionTypeValue,
    image_path: input.image_path,
    status: "pending",
  });

  if (error) {
    return {
      ok: false,
      error: error.message || "Could not save submission.",
    };
  }

  return { ok: true };
}
