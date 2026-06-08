import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck, NotebookPen } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/empty-state";
import { FollowUpStatusForm } from "@/components/follow-up-status-form";
import { NoteCard } from "@/components/note-card";
import { PageHeader } from "@/components/page-header";
import { TalkPointsSection } from "@/components/talk-points-section";
import { NOTE_CATEGORIES } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { compactCountLabel, formatDate, isOverdue } from "@/lib/utils";
import type { Employee, FollowUp, Note } from "@/lib/types";

export default async function EmployeeProfilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [employeeResult, notesResult, followUpsResult, talkPointsResult] = await Promise.all([
    supabase.from("employees").select("*").eq("id", id).single(),
    supabase.from("notes").select("*").eq("employee_id", id).order("note_date", { ascending: false }),
    supabase
      .from("follow_ups")
      .select("*, notes(id, category, severity)")
      .eq("employee_id", id)
      .order("follow_up_date", { ascending: true }),
    supabase.from("talk_points").select("id, content").eq("employee_id", id).order("created_at", { ascending: true })
  ]);

  if (employeeResult.error || !employeeResult.data) {
    notFound();
  }

  const employee = employeeResult.data as Employee;
  const notes = (notesResult.data ?? []) as Note[];
  const followUps = (followUpsResult.data ?? []) as unknown as FollowUp[];
  const openFollowUps = followUps.filter((followUp) => followUp.status === "Open");
  const talkPoints = (talkPointsResult.data ?? []) as { id: string; content: string }[];
  const highSeverityCount = notes.filter((note) => note.severity === "High").length;
  const categoryCounts = NOTE_CATEGORIES.map((category) => ({
    category,
    count: notes.filter((note) => note.category === category).length
  })).filter((item) => item.count > 0);

  return (
    <>
      <PageHeader
        eyebrow="Employee profile"
        title={employee.full_name}
        description={`${employee.role} - ${employee.team}`}
        actions={
          <ButtonLink href={`/notes/new?employee=${employee.id}`}>
            <NotebookPen aria-hidden="true" className="h-4 w-4" />
            Add Note
          </ButtonLink>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-5">
          <section className="rounded-md border border-line bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/65">Basic Information</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink/50">Status</dt>
                <dd className="font-medium text-ink">{employee.status}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/50">Start date</dt>
                <dd className="font-medium text-ink">{formatDate(employee.start_date)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/50">Team</dt>
                <dd className="font-medium text-ink">{employee.team}</dd>
              </div>
            </dl>
            {employee.notes ? <p className="mt-4 text-sm leading-6 text-ink/65">{employee.notes}</p> : null}
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-md border border-line bg-white p-4">
              <p className="text-xs text-ink/50">Total notes</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{notes.length}</p>
            </div>
            <div className="rounded-md border border-line bg-white p-4">
              <p className="text-xs text-ink/50">Open follow-ups</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{openFollowUps.length}</p>
            </div>
            <div className="rounded-md border border-line bg-white p-4">
              <p className="text-xs text-ink/50">Categories</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{categoryCounts.length}</p>
            </div>
            <div className="rounded-md border border-line bg-white p-4">
              <p className="text-xs text-ink/50">High severity</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{highSeverityCount}</p>
            </div>
          </section>

          <section className="rounded-md border border-line bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/65">Notes By Category</h2>
            {categoryCounts.length > 0 ? (
              <div className="mt-3 space-y-2">
                {categoryCounts.map((item) => (
                  <div key={item.category} className="flex items-center justify-between rounded-md bg-paper px-3 py-2 text-sm">
                    <span>{item.category}</span>
                    <span className="font-medium text-ink">{compactCountLabel(item.count, "note")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink/55">No notes yet.</p>
            )}
          </section>

          <section className="rounded-md border border-line bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/65">Open Follow-ups</h2>
            <div className="mt-3 space-y-3">
              {openFollowUps.length > 0 ? (
                openFollowUps.map((followUp) => (
                  <div key={followUp.id} className="rounded-md border border-line p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${
                          isOverdue(followUp.follow_up_date) ? "bg-red-50 text-red-700" : "bg-sage/10 text-sage"
                        }`}
                      >
                        {isOverdue(followUp.follow_up_date) ? "Overdue" : "Open"}
                      </span>
                      <span className="text-xs text-ink/50">{formatDate(followUp.follow_up_date)}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ink/70">{followUp.next_step}</p>
                    <div className="mt-3">
                      <FollowUpStatusForm id={followUp.id} status={followUp.status} />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState title="No follow-ups due." />
              )}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <TalkPointsSection employeeId={employee.id} initialPoints={talkPoints} />

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/65">Recent Notes</h2>
              <Link href={`/notes/new?employee=${employee.id}`} className="focus-ring rounded-sm text-sm font-medium text-sea hover:text-ink">
                Add note
              </Link>
            </div>
            <div className="space-y-3">
              {notes.length > 0 ? (
                notes.slice(0, 6).map((note) => <NoteCard key={note.id} note={note} />)
              ) : (
                <EmptyState title="No notes yet. Start by documenting one objective observation." />
              )}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <CalendarCheck aria-hidden="true" className="h-4 w-4 text-sage" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/65">Timeline</h2>
            </div>
            {notes.length > 0 ? (
              <div className="space-y-3 border-l border-line pl-4">
                {notes.map((note) => (
                  <div key={note.id} className="relative rounded-md border border-line bg-white p-3">
                    <span className="absolute -left-[21px] top-4 h-2.5 w-2.5 rounded-full bg-sage" />
                    <p className="text-xs text-ink/50">{formatDate(note.note_date)}</p>
                    <p className="mt-1 text-sm font-medium text-ink">{note.category}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink/65">{note.observation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No timeline yet." />
            )}
          </section>
        </div>
      </div>
    </>
  );
}
