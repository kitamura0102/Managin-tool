import Link from "next/link";
import { NotebookPen } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { FollowUpStatusForm } from "@/components/follow-up-status-form";
import { PageHeader } from "@/components/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate, isOverdue } from "@/lib/utils";
import type { FollowUp } from "@/lib/types";

export default async function FollowUpsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("follow_ups")
    .select("*, employees(id, full_name), notes(id, category, severity)")
    .order("status", { ascending: false })
    .order("follow_up_date", { ascending: true });

  const followUps = (data ?? []) as unknown as FollowUp[];
  const openFollowUps = followUps.filter((followUp) => followUp.status === "Open");
  const doneFollowUps = followUps.filter((followUp) => followUp.status === "Done").slice(0, 8);

  return (
    <>
      <PageHeader
        eyebrow="Next steps"
        title="Follow-ups"
        description="Upcoming and overdue actions from documented notes."
        actions={
          <ButtonLink href="/notes/new">
            <NotebookPen aria-hidden="true" className="h-4 w-4" />
            Add Note
          </ButtonLink>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/65">Open</h2>
            <span className="text-sm text-ink/45">{openFollowUps.length} open</span>
          </div>

          <div className="space-y-3">
            {openFollowUps.length > 0 ? (
              openFollowUps.map((followUp) => <FollowUpPanel key={followUp.id} followUp={followUp} />)
            ) : (
              <EmptyState title="No follow-ups due." />
            )}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/65">Recently Done</h2>
            <span className="text-sm text-ink/45">{doneFollowUps.length} shown</span>
          </div>

          <div className="space-y-3">
            {doneFollowUps.length > 0 ? (
              doneFollowUps.map((followUp) => <FollowUpPanel key={followUp.id} followUp={followUp} compact />)
            ) : (
              <EmptyState title="No completed follow-ups yet." />
            )}
          </div>
        </section>
      </div>
    </>
  );
}

function FollowUpPanel({ followUp, compact = false }: { followUp: FollowUp; compact?: boolean }) {
  const overdue = followUp.status === "Open" && isOverdue(followUp.follow_up_date);

  return (
    <article className="rounded-md border border-line bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href={`/employees/${followUp.employee_id}`}
            className="focus-ring rounded-sm font-semibold text-ink hover:text-sea"
          >
            {followUp.employees?.full_name ?? "Employee"}
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md px-2 py-1 text-xs font-semibold ${
                overdue ? "bg-red-50 text-red-700" : "bg-sage/10 text-sage"
              }`}
            >
              {overdue ? "Overdue" : followUp.status}
            </span>
            <span className="rounded-md bg-paper px-2 py-1 text-xs font-medium text-ink/60">
              {formatDate(followUp.follow_up_date)}
            </span>
            {followUp.notes ? (
              <span className="rounded-md bg-paper px-2 py-1 text-xs font-medium text-ink/60">
                {followUp.notes.category}
              </span>
            ) : null}
          </div>
        </div>
        <FollowUpStatusForm id={followUp.id} status={followUp.status} />
      </div>

      <p className={`mt-3 text-sm leading-6 text-ink/70 ${compact ? "line-clamp-3" : ""}`}>
        {followUp.next_step}
      </p>
    </article>
  );
}
