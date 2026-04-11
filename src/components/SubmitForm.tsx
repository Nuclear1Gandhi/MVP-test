"use client";

import { createSubmission } from "@/app/actions/submission";
import {
  Button,
  FieldError,
  ImageUploadZone,
  Input,
  Label,
  RadioField,
} from "@/components/atoms";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  STORAGE_BUCKET,
  SUBMISSION_TYPES,
} from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import {
  validateIdentifier,
  validateImageFile,
  validateSubmissionType,
} from "@/lib/validation";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

/** * Sanitizes the file name segment for Storage object keys. */
function safeStorageFileName(name: string): string {
  const base = name
    .replace(/^.*[/\\]/, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 80);
  return base || "image";
}

/** * Submission form: client-side checks, Storage upload, then server insert. */
export function SubmitForm() {
  const router = useRouter();
  const submitLockRef = useRef(false);

  const [identifier, setIdentifier] = useState("");
  const [submissionType, setSubmissionType] = useState<string>(
    SUBMISSION_TYPES[0].value,
  );
  const [file, setFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    identifier?: string;
    submission_type?: string;
    image?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitLockRef.current || isSubmitting) return;

    setFieldErrors({});
    setFormError(null);

    const idErr = validateIdentifier(identifier);
    const typeOk = validateSubmissionType(submissionType);
    let imageErr: string | null = null;
    if (!file) {
      imageErr = "Please choose an image.";
    } else {
      imageErr = validateImageFile(file);
    }

    if (idErr || !typeOk || imageErr) {
      setFieldErrors({
        identifier: idErr ?? undefined,
        submission_type: typeOk ? undefined : "Choose a submission type.",
        image: imageErr ?? undefined,
      });
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);
    let succeeded = false;

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setFormError("Your session expired. Sign in again.");
        return;
      }

      const cleanBase = safeStorageFileName(file!.name);
      const hasExt = /\.(jpe?g|png|webp)$/i.test(file!.name);
      const extFromMime =
        file!.type === "image/png"
          ? ".png"
          : file!.type === "image/webp"
            ? ".webp"
            : ".jpg";
      const fileNamePart = hasExt ? cleanBase : `${cleanBase}${extFromMime}`;
      const finalObjectPath = `${user.id}/${Date.now()}-${fileNamePart}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(finalObjectPath, file!, {
          contentType: file!.type,
          upsert: false,
        });

      if (uploadError) {
        setFormError(uploadError.message || "Upload failed. Try again.");
        return;
      }

      const result = await createSubmission({
        identifier,
        submission_type: submissionType,
        image_path: finalObjectPath,
      });

      if (!result.ok) {
        if (result.field === "identifier") {
          setFieldErrors({ identifier: result.error });
        } else if (result.field === "submission_type") {
          setFieldErrors({ submission_type: result.error });
        } else if (result.field === "image_path") {
          setFieldErrors({ image: result.error });
        } else {
          setFormError(result.error);
        }
        return;
      }

      succeeded = true;
      router.push("/submit/success");
    } finally {
      // * Always clear submitting UI; success path keeps submitLockRef set until unmount to avoid double insert.
      setIsSubmitting(false);
      if (!succeeded) {
        submitLockRef.current = false;
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-xl border border-app-border bg-app-surface p-6 shadow-[var(--shadow-card)] transition-shadow duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[var(--shadow-card-hover)]"
      noValidate
    >
      <div className="space-y-1">
        <Label htmlFor="identifier">Identifier</Label>
        <Input
          id="identifier"
          name="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Product or serial reference"
          aria-invalid={Boolean(fieldErrors.identifier)}
          aria-describedby={fieldErrors.identifier ? "identifier-error" : undefined}
        />
        <FieldError id="identifier-error">{fieldErrors.identifier}</FieldError>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-app-text">
          Submission type
        </legend>
        <div className="flex flex-col gap-2">
          {SUBMISSION_TYPES.map((t) => (
            <RadioField
              key={t.value}
              id={`submission-type-${t.value}`}
              name="submission_type"
              value={t.value}
              checked={submissionType === t.value}
              onChange={() => setSubmissionType(t.value)}
              label={t.label}
            />
          ))}
        </div>
        <FieldError>{fieldErrors.submission_type}</FieldError>
      </fieldset>

      <div>
        <ImageUploadZone
          id="image"
          name="image"
          label="Upload image"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          file={file}
          onFileChange={setFile}
          aria-invalid={Boolean(fieldErrors.image)}
          zoneSubtext={`PNG, JPG, WebP up to ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB`}
          hint={``}
          ariaDescribedBy={
            fieldErrors.image ? "image-field-error" : undefined
          }
        />
        <FieldError id="image-field-error" className="mt-1">
          {fieldErrors.image}
        </FieldError>
      </div>

      <FieldError>{formError}</FieldError>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit for review"}
      </Button>
    </form>
  );
}
