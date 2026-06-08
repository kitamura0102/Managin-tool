"use client";

import { NotebookPen } from "lucide-react";
import { updateNote } from "@/app/actions";
import { NOTE_CATEGORIES, SEVERITIES, VISIBILITIES } from "@/lib/constants";
import type { Note } from "@/lib/types";

type NoteEditFormProps = {
  note: Note;
};

export function NoteEditForm({ note }: NoteEditFormProps) {
  return (
    <form action={updateNote} className="space-y-5">
      <input type="hidden" name="id" value={note.id} />
      <input type="hidden" name="employee_id" value={note.employee_id} />

      <section className="rounded-md border border-line bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-ink">Date</span>
            <input
              name="note_date"
              type="date"
              required
              defaultValue={note.note_date}
              className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Category</span>
            <select
              name="category"
              defaultValue={note.category}
              className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            >
              {NOTE_CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-ink">Severity</span>
              <select
                name="severity"
                defaultValue={note.severity}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
              >
                {SEVERITIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-ink">Visibility</span>
              <select
                name="visibility"
                defaultValue={note.visibility}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
              >
                {VISIBILITIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-line bg-white p-4">
        <div className="grid gap-4">
          <label className="block">
            <span className="text-sm font-medium text-ink">Observation</span>
            <textarea
              name="observation"
              rows={4}
              required
              defaultValue={note.observation}
              className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-ink">Expected behavior</span>
              <textarea
                name="expected_behavior"
                rows={3}
                defaultValue={note.expected_behavior ?? ""}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Impact</span>
              <textarea
                name="impact"
                rows={3}
                defaultValue={note.impact ?? ""}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Feedback given</span>
              <textarea
                name="feedback_given"
                rows={3}
                defaultValue={note.feedback_given ?? ""}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Employee response</span>
              <textarea
                name="employee_response"
                rows={3}
                defaultValue={note.employee_response ?? ""}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-ink">Complaints / Concerns</span>
              <textarea
                name="complaints"
                rows={3}
                defaultValue={note.complaints ?? ""}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Case review comments</span>
              <textarea
                name="case_review_comments"
                rows={3}
                defaultValue={note.case_review_comments ?? ""}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <label className="block">
              <span className="text-sm font-medium text-ink">Next step</span>
              <textarea
                name="next_step"
                rows={3}
                defaultValue={note.next_step ?? ""}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Follow-up date</span>
              <input
                name="follow_up_date"
                type="date"
                defaultValue={note.follow_up_date ?? ""}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>
        </div>
      </section>

      <div className="sticky bottom-0 -mx-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur lg:mx-0 lg:rounded-md lg:border">
        <div className="flex flex-wrap items-center gap-4">
          <button className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-ink/90 sm:w-auto">
            <NotebookPen aria-hidden="true" className="h-4 w-4" />
            Save changes
          </button>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              name="is_1on1_talking_point"
              defaultChecked={note.is_1on1_talking_point}
              className="h-4 w-4 rounded border-line accent-sage"
            />
            Add to 1:1 agenda
          </label>
        </div>
      </div>
    </form>
  );
}
