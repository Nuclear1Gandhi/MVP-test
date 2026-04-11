import { resolvePostAuthRedirectPath } from "@/lib/post-auth-redirect";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/** * Exchanges an email-confirm or OAuth code for a session. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const path = resolvePostAuthRedirectPath(user?.email, nextParam);
      return NextResponse.redirect(`${origin}${path}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
