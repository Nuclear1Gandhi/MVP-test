import { LoginForm } from "@/components/LoginForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

/** * Email/password auth entry; redirects authenticated users to submit. */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const params = await searchParams;
  if (user) {
    redirect(params.next ?? "/submit");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6">
      <Suspense
        fallback={
          <p className="text-sm text-app-muted">Loading form…</p>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
