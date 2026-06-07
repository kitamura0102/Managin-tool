import Link from "next/link";
import { CalendarCheck, ClipboardPenLine, NotebookPen, Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/empty-state";
import { NoteCard } from "@/components/note-card";
import { PageHeader } from "@/components/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate, isOverdue } from "@/lib/utils";
import type { Employee, FollowUp, Note } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [employeesResult, notesResult, followUpsResult] = await Promise.all([
    supabase.from("employees").select("*").order("full_name", { ascending: true }),
    supabase
      .from("notes")
      .select("*, employees(id, full_name, role, team)")
      .order("note_date", { ascending: false })
      .limit(5),
    supabase
      .from("follow_ups")
      .select("*, employees(id, full_name), notes(id, category, severity)")
      .eq("status", "Open")
      .order("follow_up_date", { ascending: true })
      .limit(8)
  ]);

  const employees = (employeesResult.data ?? []) as Employee[];
  const recentNotes = (notesResult.data ?? []) as unknown as Note[];
  const followUps = (followUpsResult.data ?? []) as unknown as FollowUp[];
  const employeesWithOpenFollowUps = new Map(
    followUps.map((followUp) => [followUp.employee_id, followUp.employees?.full_name ?? "Employee"])
  );

  return (
    <>
      <PageHeader
        eyebrow="Private leadership notebook"
        title="Dashboard"
        description="A quiet place to document facts, patterns, coaching conversations, and next steps."
        actions={
          <>
            <ButtonLink href="/notes/new">
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add Note
            </ButtonLink>
            <ButtonLink href="/weekly-review" variant="secondary">
              <ClipboardPenLine aria-hidden="true" className="h-4 w-4" />
              Weekly Review
            </ButtonLink>
          </>
        }
      />

      <section className="mb-6 rounded-md border border-line bg-white p-4 text-sm text-ink/70">
        Document facts, impact, feedback, and next steps.
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/65">Recent Notes</h2>
            <Link href="/notes/new" className="focus-ring rounded-sm text-sm font-medium text-sea hover:text-ink">
              Add note
            </Link>
          </div>
          <div className="space-y-3">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => <NoteCard key={note.id} note={note} showEmployee />)
            ) : (
              <EmptyState
                title="No notes yet. Start by documenting one objective observation."
                action={
                  <ButtonLink href="/notes/new">
                    <NotebookPen aria-hidden="true" className="h-4 w-4" />
                    Add Note
                  </ButtonLink>
                }
              />
            )}
          </div>
        </section>

        <div className="space-y-5">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/65">Upcoming Follow-ups</h2>
              <Link href="/follow-ups" className="focus-ring rounded-sm text-sm font-medium text-sea hover:text-ink">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {followUps.length > 0 ? (
                followUps.map((followUp) => (
                  <Link
                    key={followUp.id}
                    href={`/employees/${followUp.employee_id}`}
                    className="focus-ring block rounded-md border border-line bg-white p-4 transition hover:border-sage/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-ink">{followUp.employees?.full_name ?? "Employee"}</p>
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${
                          isOverdue(followUp.follow_up_date) ? "bg-red-50 text-red-700" : "bg-sage/10 text-sage"
                        }`}
                      >
                        {isOverdue(followUp.follow_up_date) ? "Overdue" : "Open"}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-ink/50">
                      <CalendarCheck aria-hidden="true" className="h-3.5 w-3.5" />
                      {formatDate(followUp.follow_up_date)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-ink/70">{followUp.next_step}</p>
                  </Link>
                ))
              ) : (
                <EmptyState title="No follow-ups due." />
              )}
            </div>
          </section>

          <section className="rounded-md border border-line bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/65">Employees With Open Follow-ups</h2>
            {employeesWithOpenFollowUps.size > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from(employeesWithOpenFollowUps).map(([id, name]) => (
                  <Link
                    key={id}
                    href={`/employees/${id}`}
                    className="focus-ring rounded-md bg-paper px-3 py-2 text-sm font-medium text-ink hover:bg-line/60"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink/55">No employees currently have open follow-ups.</p>
            )}
          </section>

          <section className="grid grid-cols-3 gap-2">
            <div className="rounded-md border border-line bg-white p-3">
              <p className="text-xs text-ink/50">Employees</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{employees.length}</p>
            </div>
            <div className="rounded-md border border-line bg-white p-3">
              <p className="text-xs text-ink/50">Open</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{followUps.length}</p>
            </div>
            <div className="rounded-md border border-line bg-white p-3">
              <p className="text-xs text-ink/50">Recent</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{recentNotes.length}</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
