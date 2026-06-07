import { UserRoundPlus } from "lucide-react";
import { EmployeeForm } from "@/components/employee-form";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { WeeklyReviewForm } from "@/components/weekly-review-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Employee } from "@/lib/types";

export default async function WeeklyReviewPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("employees")
    .select("id, full_name, role")
    .eq("status", "Active")
    .order("full_name", { ascending: true });

  const employees = (data ?? []) as Pick<Employee, "id" | "full_name" | "role">[];

  return (
    <>
      <PageHeader
        eyebrow="Friday habit"
        title="Weekly Review"
        description="Capture the week, decide what needs follow-up, and create multiple notes without leaving the page."
      />

      {saved ? (
        <div className="mb-5 rounded-md border border-sage/30 bg-sage/10 px-4 py-3 text-sm font-medium text-sage">
          Weekly review saved.
        </div>
      ) : null}

      {employees.length > 0 ? (
        <WeeklyReviewForm employees={employees} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <EmployeeForm />
          <EmptyState
            title="No employees added yet."
            action={
              <div className="inline-flex items-center gap-2 text-sm font-medium text-sage">
                <UserRoundPlus aria-hidden="true" className="h-4 w-4" />
                Add an employee before creating weekly notes.
              </div>
            }
          />
        </div>
      )}
    </>
  );
}
