"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { addTalkPoint, deleteTalkPoint } from "@/app/actions";

type TalkPoint = { id: string; content: string };

type TalkPointsSectionProps = {
  employeeId: string;
  initialPoints: TalkPoint[];
};

export function TalkPointsSection({ employeeId, initialPoints }: TalkPointsSectionProps) {
  const [points, setPoints] = useState<TalkPoint[]>(initialPoints);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = inputRef.current?.value.trim();
    if (!content) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.set("employee_id", employeeId);
      formData.set("content", content);
      const newPoint = await addTalkPoint(formData);
      setPoints((prev) => [...prev, newPoint]);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", id);
      await deleteTalkPoint(formData);
      setPoints((prev) => prev.filter((p) => p.id !== id));
    });
  }

  return (
    <section className="rounded-md border border-line bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/65">1:1 Talk Points</h2>
      <p className="mt-1 text-xs text-ink/40">Recordatorios para tu próxima conversación de coaching.</p>

      <ul className="mt-3 space-y-2">
        {points.length === 0 && (
          <li className="text-sm text-ink/40">No hay talk points todavía.</li>
        )}
        {points.map((point) => (
          <li key={point.id} className="flex items-start gap-2 rounded-md bg-paper px-3 py-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
            <span className="flex-1 text-sm leading-6 text-ink/80">{point.content}</span>
            <button
              type="button"
              onClick={() => handleDelete(point.id)}
              disabled={isPending}
              className="focus-ring mt-1 rounded-sm text-ink/30 hover:text-red-500 disabled:opacity-40"
            >
              <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="mt-3 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Agregar punto..."
          className="focus-ring flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending}
          className="focus-ring flex items-center gap-1 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:bg-paper disabled:opacity-50"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add
        </button>
      </form>
    </section>
  );
}
