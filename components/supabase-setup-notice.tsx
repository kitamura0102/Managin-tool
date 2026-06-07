import { Database } from "lucide-react";

export function SupabaseSetupNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <section className="w-full max-w-xl rounded-md border border-line bg-white p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-sea/10 text-sea">
            <Database aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sage">Setup required</p>
            <h1 className="mt-2 text-2xl font-semibold text-ink">Connect Supabase</h1>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`, then run
              `supabase/schema.sql` in your Supabase project.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
