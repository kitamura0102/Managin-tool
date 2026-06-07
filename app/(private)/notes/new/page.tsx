import { UserRoundPlus } from "lucide-react";
import { EmployeeForm } from "@/components/employee-form";
import { EmptyState } from "@/components/empty-state";
import { NoteForm } from "@/components/note-form";
import { PageHeader } from "@/components/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Employee } from "@/lib/types";

export default async function NewNotePage({
  searchParams
}: {
  searchParams: Promise<{ employee?: string }>;
}) {
  const { employee: defaultEmployeeId } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("employees")
    .select("id, full_name, role, team")
    .eq("status", "Active")
    .order("full_name", { ascending: true });

  const employees = (data ?? []) as Pick<Employee, "id" | "full_name" | "role" | "team">[];

  return (
    <>
      <PageHeader
        eyebrow="Fast capture"
        title="Add Note"
        description="Document one objective observation in under a minute, then add detail only where it helps."
      />

      {employees.length > 0 ? (
        <NoteForm employees={employees} defaultEmployeeId={defaultEmployeeId} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <EmployeeForm />
          <EmptyState
            title="No employees added yet."
            action={
              <div className="inline-flex items-center gap-2 text-sm font-medium text-sage">
                <UserRoundPlus aria-hidden="true" className="h-4 w-4" />
                Add an employee before creating notes.
              </div>
            }
          />
        </div>
      )}
    </>
  );
}
