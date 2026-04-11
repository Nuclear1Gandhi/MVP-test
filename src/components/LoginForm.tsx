"use client";

import { Button, HelperText, InlineMessage, Input, Label } from "@/components/atoms";
import { createClient } from "@/lib/supabase/client";
import { isSafeRelativeAppPath } from "@/lib/safe-app-path";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

/** * Email + password sign-in and sign-up for the MVP. */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedNext = searchParams.get("next");
  const nextPath = requestedNext ?? "/submit";
  const authError = searchParams.get("error");

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(
    authError === "auth" ? "Authentication failed. Try again." : null,
  );
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isPending) return;
    setMessage(null);
    setIsPending(true);

    const supabase = createClient();
    const origin = window.location.origin;

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
          },
        });
        if (error) {
          setMessage(error.message);
          return;
        }
        setMessage(
          "Check your email to confirm your account.",
        );
        setMode("signin");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
        return;
      }
      if (requestedNext && isSafeRelativeAppPath(requestedNext)) {
        router.push(requestedNext);
        router.refresh();
        return;
      }
      window.location.assign(
        new URL("/auth/post-login", window.location.origin).toString(),
      );
      return;
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col">
      <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight text-app-text">
        {mode === "signup" ? "Create account" : "Sign in"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 rounded-xl border border-app-border bg-app-surface p-6 shadow-[var(--shadow-card)] transition-shadow duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[var(--shadow-card-hover)]"
      >
      <div className="flex gap-2 rounded-md border border-app-border/80 bg-app-offset-2 p-1">
        <button
          type="button"
          className={`flex-1 cursor-pointer rounded px-3 py-1.5 text-sm font-medium transition-[background-color,color,box-shadow] duration-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mode === "signin"
              ? "bg-app-surface-2 text-app-text shadow-[var(--shadow-sm)]"
              : "text-app-muted hover:text-app-text"
          }`}
          onClick={() => {
            setMode("signin");
            setMessage(null);
          }}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`flex-1 cursor-pointer rounded px-3 py-1.5 text-sm font-medium transition-[background-color,color,box-shadow] duration-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mode === "signup"
              ? "bg-app-surface-2 text-app-text shadow-[var(--shadow-sm)]"
              : "text-app-muted hover:text-app-text"
          }`}
          onClick={() => {
            setMode("signup");
            setMessage(null);
          }}
        >
          Create account
        </button>
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === "signup" ? (
          <HelperText>At least 6 characters. Use a strong password in production.</HelperText>
        ) : null}
      </div>

      <InlineMessage
        tone={message?.startsWith("Check your email") ? "success" : "error"}
      >
        {message}
      </InlineMessage>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
      </Button>
      </form>
    </div>
  );
}
