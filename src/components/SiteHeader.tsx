import { Button } from "@/components/atoms";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

/** * Top navigation with auth-aware links. */
export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const showAdmin = user?.email ? isAdminEmail(user.email) : false;

  return (
    <header className="sticky top-0 z-40 border-b border-app-border bg-app-surface shadow-[var(--shadow-sm)]">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={user ? "/submit" : "/"}
          className="flex min-w-0 items-center gap-2 text-sm font-semibold tracking-tight text-app-text"
        >
          <span className="truncate">Submission MVP</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex items-center gap-3 text-sm sm:gap-4">
            {user ? (
              <>
                <Link
                  href="/submit"
                  className="text-app-muted transition-colors hover:text-app-text"
                >
                  Submit
                </Link>
                {showAdmin ? (
                  <Link
                    href="/admin"
                    className="text-app-muted transition-colors hover:text-app-text"
                  >
                    Admin
                  </Link>
                ) : null}
                <form action="/auth/signout" method="post">
                  <Button type="submit" variant="ghost" className="p-0 font-normal">
                    Sign out
                  </Button>
                </form>
              </>
            ) : null}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
