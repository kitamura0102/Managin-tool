"use client";

import { useState } from "react";
import { ClipboardPenLine, Plus, Trash2 } from "lucide-react";
import { createWeeklyReviewWithNotes } from "@/app/actions";
import { NOTE_CATEGORIES, SEVERITIES, VISIBILITIES, WRITING_GUIDANCE } from "@/lib/constants";
import { fridayWeekRange, todayISO } from "@/lib/utils";
import type { Employee } from "@/lib/types";

type WeeklyReviewFormProps = {
  employees: Pick<Employee, "id" | "full_name" | "role">[];
};

export function WeeklyReviewForm({ employees }: WeeklyReviewFormProps) {
  const weekRange = fridayWeekRange();
  const [rows, setRows] = useState([0]);
  const [nextRowId, setNextRowId] = useState(1);

  function addRow() {
    setRows((current) => [...current, nextRowId]);
    setNextRowId((current) => current + 1);
  }

  function removeRow(rowId: number) {
    setRows((current) => (current.length === 1 ? current : current.filter((id) => id !== rowId)));
  }

  return (
    <form action={createWeeklyReviewWithNotes} className="space-y-5">
      <input type="hidden" name="note_count" value={rows.length} />

      <section className="rounded-md border border-line bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sage/10 text-sage">
            <ClipboardPenLine aria-hidden="true" className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-ink">Weekly Review</h2>
            <p className="mt-1 text-sm leading-6 text-ink/60">
              Use this page as a Friday checkpoint. Capture the week, then convert specific observations into notes.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-line bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-ink">Week start</span>
            <input
              name="review_week_start"
              type="date"
              required
              defaultValue={weekRange.start}
              className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Week end</span>
            <input
              name="review_week_end"
              type="date"
              required
              defaultValue={weekRange.end}
              className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4">
          <label className="block">
            <span className="text-sm font-medium text-ink">What happened this week that impacted the team, client, quality, or workload?</span>
            <textarea name="team_impact_notes" rows={3} className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Did I give clear feedback?</span>
            <textarea name="feedback_given" rows={3} className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Did the employee acknowledge the expectation?</span>
            <textarea name="expectation_acknowledged" rows={3} className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Is this a one-time issue or a repeated pattern?</span>
            <textarea name="repeated_patterns" rows={3} className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">What should I follow up on next week?</span>
            <textarea name="next_week_priorities" rows={3} className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm" />
          </label>
        </div>
      </section>

      <section className="rounded-md border border-line bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/65">Create Notes From This Review</h2>
            <p className="mt-1 text-sm text-ink/55">Leave a row blank if it is only a general review item.</p>
          </div>
          <button
            type="button"
            onClick={addRow}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink hover:bg-paper"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add Note
          </button>
        </div>

        <div className="mt-4 rounded-md bg-paper p-3 text-sm leading-6 text-ink/65">
          {WRITING_GUIDANCE[0]} {WRITING_GUIDANCE[2]}
        </div>

        <div className="mt-4 space-y-4">
          {rows.map((rowId, index) => (
            <WeeklyNoteRow key={rowId} index={index} employees={employees} onRemove={() => removeRow(rowId)} />
          ))}
        </div>
      </section>

      <div className="sticky bottom-0 -mx-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur lg:mx-0 lg:rounded-md lg:border">
        <button className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-ink/90 sm:w-auto">
          <ClipboardPenLine aria-hidden="true" className="h-4 w-4" />
          Save Weekly Review
        </button>
      </div>
    </form>
  );
}

function WeeklyNoteRow({
  index,
  employees,
  onRemove
}: {
  index: number;
  employees: Pick<Employee, "id" | "full_name" | "role">[];
  onRemove: () => void;
}) {
  return (
    <div className="rounded-md border border-line p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">Note {index + 1}</p>
        <button
          type="button"
          onClick={onRemove}
          className="focus-ring inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-ink/55 hover:bg-paper hover:text-ink"
          aria-label={`Remove note ${index + 1}`}
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">Employee</span>
          <select name={`note_${index}_employee_id`} className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm" defaultValue="">
            <option value="">Choose employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name} - {employee.role}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Note date</span>
          <input name={`note_${index}_note_date`} type="date" defaultValue={todayISO()} className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Category</span>
          <select name={`note_${index}_category`} defaultValue="Performance" className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm">
            {NOTE_CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-ink">Severity</span>
            <select name={`note_${index}_severity`} defaultValue="Low" className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm">
              {SEVERITIES.map((severity) => (
                <option key={severity}>{severity}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Visibility</span>
            <select name={`note_${index}_visibility`} defaultValue="Private note" className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm">
              {VISIBILITIES.map((visibility) => (
                <option key={visibility}>{visibility}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-3 grid gap-3">
        <label className="block">
          <span className="text-sm font-medium text-ink">Observation</span>
          <textarea
            name={`note_${index}_observation`}
            rows={3}
            className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            placeholder="Write the specific fact, event, behavior, or example."
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <TextareaField name={`note_${index}_expected_behavior`} label="Expected behavior" rows={2} />
          <TextareaField name={`note_${index}_impact`} label="Impact" rows={2} />
          <TextareaField name={`note_${index}_feedback_given`} label="Feedback given" rows={2} />
          <TextareaField name={`note_${index}_employee_response`} label="Employee response" rows={2} />
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <TextareaField name={`note_${index}_next_step`} label="Next step" rows={2} />
          <label className="block">
            <span className="text-sm font-medium text-ink">Follow-up date</span>
            <input
              name={`note_${index}_follow_up_date`}
              type="date"
              className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function TextareaField({ name, label, rows }: { name: string; label: string; rows: number }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <textarea
        name={name}
        rows={rows}
        className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
      />
    </label>
  );
}
