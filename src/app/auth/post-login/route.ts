import { resolvePostAuthRedirectPath } from "@/lib/post-auth-redirect";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * * Full navigation target after client password sign-in so the server session cookie is always applied.
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next");
  const path = resolvePostAuthRedirectPath(user.email ?? undefined, next);

  return NextResponse.redirect(new URL(path, request.url));
}
