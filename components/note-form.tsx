"use client";

import { useMemo, useState } from "react";
import { FileText, NotebookPen } from "lucide-react";
import { createNote } from "@/app/actions";
import { NOTE_CATEGORIES, NOTE_TEMPLATES, SEVERITIES, VISIBILITIES, WRITING_GUIDANCE } from "@/lib/constants";
import { todayISO } from "@/lib/utils";
import type { Employee, NoteCategory } from "@/lib/types";

type NoteFormProps = {
  employees: Pick<Employee, "id" | "full_name" | "role" | "team">[];
  defaultEmployeeId?: string;
};

export function NoteForm({ employees, defaultEmployeeId }: NoteFormProps) {
  const [templateId, setTemplateId] = useState(NOTE_TEMPLATES[0].id);
  const selectedTemplate = useMemo(
    () => NOTE_TEMPLATES.find((template) => template.id === templateId) ?? NOTE_TEMPLATES[0],
    [templateId]
  );
  const [category, setCategory] = useState<NoteCategory>(selectedTemplate.category);

  function applyTemplate(id: string) {
    const template = NOTE_TEMPLATES.find((item) => item.id === id) ?? NOTE_TEMPLATES[0];
    setTemplateId(id);
    setCategory(template.category);
  }

  return (
    <form action={createNote} className="space-y-5">
      <section className="rounded-md border border-line bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sage/10 text-sage">
            <FileText aria-hidden="true" className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-ink">Objective Documentation</h2>
            <div className="mt-2 grid gap-2 text-sm leading-6 text-ink/65 sm:grid-cols-2">
              {WRITING_GUIDANCE.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-line bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/65">Template</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {NOTE_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => applyTemplate(template.id)}
              className={`focus-ring rounded-md border px-3 py-3 text-left text-sm transition ${
                templateId === template.id ? "border-sage bg-sage/10 text-ink" : "border-line bg-white text-ink/65 hover:bg-paper"
              }`}
            >
              <span className="font-semibold">{template.name}</span>
              <span className="mt-1 block text-xs leading-5 text-ink/50">{template.helper}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-line bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-ink">Employee</span>
            <select
              name="employee_id"
              required
              defaultValue={defaultEmployeeId ?? employees[0]?.id}
              className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name} - {employee.role}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Date</span>
            <input
              name="note_date"
              type="date"
              required
              defaultValue={todayISO()}
              className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Category</span>
            <select
              name="category"
              value={category}
              onChange={(event) => setCategory(event.target.value as NoteCategory)}
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
                defaultValue="Low"
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
                defaultValue="Private note"
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
              className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
              placeholder={selectedTemplate.placeholders.observation}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-ink">Expected behavior</span>
              <textarea
                name="expected_behavior"
                rows={3}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
                placeholder={selectedTemplate.placeholders.expected_behavior}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Impact</span>
              <textarea
                name="impact"
                rows={3}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
                placeholder={selectedTemplate.placeholders.impact}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Feedback given</span>
              <textarea
                name="feedback_given"
                rows={3}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
                placeholder={selectedTemplate.placeholders.feedback_given}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Employee response</span>
              <textarea
                name="employee_response"
                rows={3}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
                placeholder={selectedTemplate.placeholders.employee_response}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <label className="block">
              <span className="text-sm font-medium text-ink">Next step</span>
              <textarea
                name="next_step"
                rows={3}
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
                placeholder={selectedTemplate.placeholders.next_step}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Follow-up date</span>
              <input
                name="follow_up_date"
                type="date"
                className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
              />
              <p className="mt-2 text-xs leading-5 text-ink/50">A follow-up is created when this date and next step are filled.</p>
            </label>
          </div>
        </div>
      </section>

      <div className="sticky bottom-0 -mx-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur lg:mx-0 lg:rounded-md lg:border">
        <div className="flex flex-wrap items-center gap-4">
          <button className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-ink/90 sm:w-auto">
            <NotebookPen aria-hidden="true" className="h-4 w-4" />
            Add Note
          </button>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              name="is_1on1_talking_point"
              className="h-4 w-4 rounded border-line accent-sage"
            />
            Add to 1:1 agenda
          </label>
        </div>
      </div>
    </form>
  );
}
