"use client";

import { ThemeProvider as NextThemesProvider } from "@ecosy/next-themes";
import type { ReactNode } from "react";

/** * localStorage key for persisted theme (matches previous app behavior). */
export const THEME_STORAGE_KEY = "submit-app-theme";

type ThemeProviderProps = {
  children: ReactNode;
};

/** * Wraps the app with @ecosy/next-themes (React 19–safe fork) and syncs `data-theme` on `<html>` before paint. */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      storageKey={THEME_STORAGE_KEY}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
