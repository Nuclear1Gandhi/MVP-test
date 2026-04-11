import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** * Root route: admins to /admin, other signed-in users to /submit, else /login. */
export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (isAdminEmail(user.email)) {
      redirect("/admin");
    }
    redirect("/submit");
  }

  redirect("/login");
}
