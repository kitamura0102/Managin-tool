import { createEmployee } from "@/app/actions";

export function EmployeeForm() {
  return (
    <form action={createEmployee} className="space-y-4 rounded-md border border-line bg-white p-4">
      <div>
        <h2 className="text-base font-semibold text-ink">Add Employee</h2>
        <p className="mt-1 text-sm text-ink/55">Keep the roster simple. Notes stay private to your account.</p>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-ink">Full name</span>
        <input
          name="full_name"
          required
          className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
          placeholder="Employee name"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">Role</span>
          <input
            name="role"
            required
            className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            placeholder="Support Specialist"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Team</span>
          <input
            name="team"
            required
            className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            placeholder="Client Operations"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">Start date</span>
          <input
            name="start_date"
            type="date"
            className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Status</span>
          <select
            name="status"
            defaultValue="Active"
            className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-ink">Optional notes</span>
        <textarea
          name="notes"
          rows={3}
          className="focus-ring mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
          placeholder="Private context for you as the team lead."
        />
      </label>

      <button className="focus-ring w-full rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink/90">
        Add Employee
      </button>
    </form>
  );
}
