import Link from "next/link";
import { NotebookPen, UserRoundPlus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { EmployeeForm } from "@/components/employee-form";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Employee, FollowUp } from "@/lib/types";

export default async function EmployeesPage() {
  const supabase = await createSupabaseServerClient();
  const [employeesResult, followUpsResult] = await Promise.all([
    supabase.from("employees").select("*").order("full_name", { ascending: true }),
    supabase.from("follow_ups").select("employee_id").eq("status", "Open")
  ]);

  const employees = (employeesResult.data ?? []) as Employee[];
  const followUps = (followUpsResult.data ?? []) as Pick<FollowUp, "employee_id">[];
  const openFollowUpCounts = followUps.reduce<Map<string, number>>((map, followUp) => {
    map.set(followUp.employee_id, (map.get(followUp.employee_id) ?? 0) + 1);
    return map;
  }, new Map());

  return (
    <>
      <PageHeader
        eyebrow="Roster"
        title="Employees"
        description="Add only the people you manage directly. This app does not create employee-facing access."
        actions={
          <ButtonLink href="/notes/new">
            <NotebookPen aria-hidden="true" className="h-4 w-4" />
            Add Note
          </ButtonLink>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <EmployeeForm />

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/65">Team Roster</h2>
            <span className="text-sm text-ink/45">{employees.length} total</span>
          </div>

          {employees.length > 0 ? (
            <div className="space-y-3">
              {employees.map((employee) => (
                <Link
                  key={employee.id}
                  href={`/employees/${employee.id}`}
                  className="focus-ring block rounded-md border border-line bg-white p-4 transition hover:border-sage/40"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-ink">{employee.full_name}</p>
                      <p className="mt-1 text-sm text-ink/55">
                        {employee.role} - {employee.team}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-md bg-paper px-2 py-1 text-xs font-medium text-ink/60">
                        {employee.status}
                      </span>
                      <span className="rounded-md bg-sage/10 px-2 py-1 text-xs font-medium text-sage">
                        {openFollowUpCounts.get(employee.id) ?? 0} open follow-ups
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-ink/45">Start date: {formatDate(employee.start_date)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No employees added yet."
              action={
                <div className="inline-flex items-center gap-2 text-sm font-medium text-sage">
                  <UserRoundPlus aria-hidden="true" className="h-4 w-4" />
                  Add the first employee with the form.
                </div>
              }
            />
          )}
        </section>
      </div>
    </>
  );
}
