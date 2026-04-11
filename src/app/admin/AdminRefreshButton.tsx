"use client";

import { Button } from "@/components/atoms";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * * Triggers a Next.js soft refresh so the server re-fetches pending submissions.
 */
export function AdminRefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      type="button"
      disabled={isPending}
      className="shrink-0"
      onClick={() => {
        startTransition(() => {
          router.refresh();
        });
      }}
    >
      {isPending ? "Refreshing…" : "Refresh"}
    </Button>
  );
}
