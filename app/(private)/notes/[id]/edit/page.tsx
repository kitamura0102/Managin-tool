import { notFound } from "next/navigation";
import { NoteEditForm } from "@/components/note-edit-form";
import { PageHeader } from "@/components/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Note } from "@/lib/types";

export default async function EditNotePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from("notes").select("*").eq("id", id).single();

  if (error || !data) {
    notFound();
  }

  const note = data as Note;

  return (
    <>
      <PageHeader
        eyebrow="Edit note"
        title="Edit Note"
        description="Update the details of this observation."
      />
      <NoteEditForm note={note} />
    </>
  );
}
