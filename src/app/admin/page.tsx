import {
  PendingSubmissionsTable,
  type PendingSubmissionTableRow,
} from "./PendingSubmissionsTable";
import { STORAGE_BUCKET, SUBMISSION_TYPES } from "@/lib/constants";
import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";
import Link from "next/link";
import { redirect } from "next/navigation";

function typeLabel(value: string): string {
  return SUBMISSION_TYPES.find((t) => t.value === value)?.label ?? value;
}

/** * Admin-only list of pending submissions (secret API key + signed image URLs). */
export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login?next=/admin");
  }
  if (!isAdminEmail(user.email)) {
    redirect("/submit");
  }

  let service;
  try {
    service = createServiceRoleClient();
  } catch {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-xl font-semibold text-app-text">Admin</h1>
        <p className="mt-4 text-sm text-app-error">
          Set{" "}
          <code className="rounded bg-app-code-bg px-1 font-mono text-xs text-app-text">
            SUPABASE_SECRET_KEY
          </code>{" "}
          (or legacy{" "}
          <code className="rounded bg-app-code-bg px-1 font-mono text-xs text-app-text">
            SUPABASE_SERVICE_ROLE_KEY
          </code>
          ) on the server to load pending submissions. Never expose this key to the browser.
        </p>
        <Link href="/submit" className="mt-6 inline-block text-sm text-app-muted underline transition-colors hover:text-app-text">
          Back to submit
        </Link>
      </div>
    );
  }

  const { data: rows, error } = await service
    .from("submissions")
    .select(
      "id, user_id, identifier, submission_type, image_path, status, created_at",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-sm text-app-error">{error.message}</p>
      </div>
    );
  }

  const list = rows ?? [];
  const withPreview = await Promise.all(
    list.map(async (row) => {
      const { data: signed } = await service.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(row.image_path, 3600);
      return { ...row, previewUrl: signed?.signedUrl ?? null };
    }),
  );

  const uniqueUserIds = [...new Set(withPreview.map((r) => r.user_id))];
  const emailByUserId = new Map<string, string | null>();
  await Promise.all(
    uniqueUserIds.map(async (uid) => {
      const { data, error: userError } = await service.auth.admin.getUserById(uid);
      if (userError || !data.user) {
        emailByUserId.set(uid, null);
        return;
      }
      emailByUserId.set(uid, data.user.email ?? null);
    }),
  );

  const tableRows: PendingSubmissionTableRow[] = withPreview.map((row) => ({
    id: row.id,
    identifier: row.identifier,
    typeLabel: typeLabel(row.submission_type),
    user_id: row.user_id,
    user_email: emailByUserId.get(row.user_id) ?? null,
    created_at: row.created_at,
    previewUrl: row.previewUrl,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-app-text">Pending submissions</h1>
      <p className="mt-2 text-sm text-app-muted">
        Signed image links expire in one hour. Refresh the page to regenerate.
      </p>

      <PendingSubmissionsTable rows={tableRows} />
    </div>
  );
}
