import { SubmitForm } from "@/components/SubmitForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** * Protected submission form (middleware enforces session). */
export default async function SubmitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/submit");
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-app-text">New submission</h1>
      <p className="mb-8 text-sm text-app-muted">
        Upload an image and enter your details. Your submission stays{" "}
        <span className="font-medium text-app-text">pending</span> until reviewed.
      </p>
      <SubmitForm />
    </div>
  );
}
