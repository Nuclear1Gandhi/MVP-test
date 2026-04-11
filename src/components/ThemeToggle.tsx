"use client";

import { useTheme } from "@ecosy/next-themes";
import { startTransition, useEffect, useState } from "react";

/** * Re-export for callers that reference the storage key. */
export { THEME_STORAGE_KEY } from "@/components/ThemeProvider";

/** * Header control: toggles light/dark and shows sun/moon icon for the *next* mode. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  function toggle() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  const showSun = resolvedTheme === "dark";
  const ariaLabel = showSun ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent text-app-muted transition-[background-color,color,border-color] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-app-border hover:bg-app-offset hover:text-app-text disabled:cursor-not-allowed"
      aria-label={mounted ? ariaLabel : "Switch theme"}
      onClick={toggle}
    >
      {/* * Icon follows resolvedTheme only after mount so SSR and first client paint match. */}
      {mounted ? (
        showSun ? (
          <SunIcon />
        ) : (
          <MoonIcon />
        )
      ) : (
        <span className="block size-[18px]" aria-hidden />
      )}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx={12} cy={12} r={5} />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}
