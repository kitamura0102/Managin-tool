import Link from "next/link";
import { AlertCircle, CheckCircle2, Eye, LockKeyhole } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Note } from "@/lib/types";

const severityClass = {
  Low: "bg-sage/10 text-sage",
  Medium: "bg-clay/10 text-clay",
  High: "bg-red-50 text-red-700"
};

type NoteCardProps = {
  note: Note;
  showEmployee?: boolean;
};

export function NoteCard({ note, showEmployee = false }: NoteCardProps) {
  return (
    <article className="rounded-md border border-line bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-ink px-2 py-1 text-xs font-medium text-white">{note.category}</span>
        <span className={`rounded-md px-2 py-1 text-xs font-medium ${severityClass[note.severity]}`}>
          {note.severity}
        </span>
        <span className="text-xs text-ink/50">{formatDate(note.note_date)}</span>
        <span className="ml-auto flex items-center gap-1 text-xs text-ink/45">
          {note.visibility === "Private note" ? (
            <LockKeyhole aria-hidden="true" className="h-3.5 w-3.5" />
          ) : (
            <Eye aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          {note.visibility}
        </span>
      </div>
      {showEmployee && note.employees ? (
        <Link
          href={`/employees/${note.employee_id}`}
          className="focus-ring mt-3 inline-flex rounded-sm text-sm font-medium text-sea hover:text-ink"
        >
          {note.employees.full_name}
        </Link>
      ) : null}
      <p className="mt-3 text-sm leading-6 text-ink">{note.observation}</p>
      {note.impact ? <p className="mt-2 text-sm leading-6 text-ink/65">Impact: {note.impact}</p> : null}
      {note.next_step ? (
        <div className="mt-3 flex gap-2 rounded-md bg-paper p-3 text-sm text-ink/70">
          {note.follow_up_date ? (
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
          ) : (
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
          )}
          <span>
            {note.next_step}
            {note.follow_up_date ? ` Due ${formatDate(note.follow_up_date)}.` : ""}
          </span>
        </div>
      ) : null}
    </article>
  );
}
