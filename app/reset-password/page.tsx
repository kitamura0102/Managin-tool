"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
        <p className="text-sm text-ink/60">Verifying reset link…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-md rounded-md border border-line bg-white p-5 shadow-soft">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sage">Private workspace</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">Set new password</h1>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            Enter a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-ink">New password</span>
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

          <label className="block">
            <span className="text-sm font-medium text-ink">Confirm password</span>
            <span className="mt-1 flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-sage/25">
              <LockKeyhole aria-hidden="true" className="h-4 w-4 text-ink/40" />
              <input
                name="confirm"
                type="password"
                required
                minLength={6}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Repeat your password"
              />
            </span>
          </label>

          {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring w-full rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Working..." : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
}
