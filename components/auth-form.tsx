"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setResetSent(true);
  }

  return (
    <div className="w-full max-w-md rounded-md border border-line bg-white p-5 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-sage">Private workspace</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">Leadership Notebook</h1>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          Sign in to document objective notes, coaching context, and follow-up actions.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 rounded-md border border-line bg-paper p-1">
        <button
          type="button"
          onClick={() => setMode("sign-in")}
          className={`focus-ring rounded-md px-3 py-2 text-sm font-medium ${
            mode === "sign-in" ? "bg-white text-ink shadow-sm" : "text-ink/55"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("sign-up")}
          className={`focus-ring rounded-md px-3 py-2 text-sm font-medium ${
            mode === "sign-up" ? "bg-white text-ink shadow-sm" : "text-ink/55"
          }`}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-ink">Email</span>
          <span className="mt-1 flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-sage/25">
            <Mail aria-hidden="true" className="h-4 w-4 text-ink/40" />
            <input
              name="email"
              type="email"
              required
              className="w-full bg-transparent text-sm outline-none"
              placeholder="you@example.com"
            />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink">Password</span>
          <span className="mt-1 flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-sage/25">
            <LockKeyhole aria-hidden="true" className="h-4 w-4 text-ink/40" />
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Minimum 6 characters"
            />
          </span>
        </label>

        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring w-full rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Working..." : mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </form>

      {mode === "sign-in" && (
        <div className="mt-4 border-t border-line pt-4">
          {resetSent ? (
            <p className="text-center text-sm text-ink/60">Check your email for a password reset link.</p>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <p className="text-xs font-medium text-ink/50">Forgot your password?</p>
              <div className="flex gap-2">
                <span className="flex flex-1 items-center gap-2 rounded-md border border-line bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-sage/25">
                  <Mail aria-hidden="true" className="h-4 w-4 text-ink/40" />
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="you@example.com"
                  />
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  className="focus-ring rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:bg-paper disabled:opacity-60"
                >
                  Send reset
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
