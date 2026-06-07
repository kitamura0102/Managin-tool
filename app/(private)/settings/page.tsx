import { Database, LockKeyhole, NotebookPen, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ButtonLink } from "@/components/ui/button-link";

export default function SettingsPage() {
  const hasSupabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasSupabaseAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="A small checklist for keeping this leadership notebook private and focused."
        actions={
          <ButtonLink href="/notes/new">
            <NotebookPen aria-hidden="true" className="h-4 w-4" />
            Add Note
          </ButtonLink>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-md border border-line bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sage/10 text-sage">
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink">Privacy Boundaries</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/65">
                <li>No public sharing features.</li>
                <li>No employee-facing access.</li>
                <li>No chat, surveillance, payroll, or leave approval workflows.</li>
                <li>No AI features are included in this version.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-md border border-line bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sea/10 text-sea">
              <Database aria-hidden="true" className="h-4 w-4" />
            </div>
            <div className="w-full">
              <h2 className="text-base font-semibold text-ink">Supabase Setup</h2>
              <div className="mt-3 space-y-2 text-sm">
                <StatusRow label="Project URL" ready={hasSupabaseUrl} />
                <StatusRow label="Anon key" ready={hasSupabaseAnonKey} />
                <StatusRow label="Schema and RLS" ready={false} note="Run supabase/schema.sql in Supabase." />
                <StatusRow label="Demo data" ready={false} note="Optional: run supabase/seed.sql after replacing the user UUID." />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-md border border-line bg-white p-4 lg:col-span-2">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-clay/10 text-clay">
              <LockKeyhole aria-hidden="true" className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink">Documentation Standard</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/65">
                Keep notes factual and specific. Use PTO or attendance details as context, and connect performance notes to
                expectations, observed behavior, impact, feedback, employee response, and next steps.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function StatusRow({ label, ready, note }: { label: string; ready: boolean; note?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md bg-paper px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="font-medium text-ink">{label}</span>
      <span className={ready ? "text-sage" : "text-ink/50"}>{ready ? "Configured" : note ?? "Not configured"}</span>
    </div>
  );
}
