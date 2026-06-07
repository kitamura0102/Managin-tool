import { LockKeyhole, LogOut, NotebookTabs } from "lucide-react";
import { signOut } from "@/app/actions";
import { Navigation } from "@/components/navigation";

type AppShellProps = {
  children: React.ReactNode;
  userEmail?: string | null;
};

export function AppShell({ children, userEmail }: AppShellProps) {
  return (
    <div className="min-h-screen bg-paper">
      <aside className="border-b border-line bg-paper/95 px-4 py-4 lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-6">
        <div className="mx-auto max-w-7xl lg:mx-0">
          <div className="flex items-center justify-between gap-4 lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-white">
                <NotebookTabs aria-hidden="true" className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Leadership Notebook</p>
                <p className="text-xs text-ink/55">Private documentation</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-md border border-line bg-white px-2 py-1 text-xs text-ink/60 sm:flex lg:mt-5 lg:flex">
              <LockKeyhole aria-hidden="true" className="h-3.5 w-3.5" />
              Auth required
            </div>
          </div>

          <div className="mt-5 lg:mt-8">
            <Navigation />
          </div>

          <div className="mt-5 hidden rounded-md border border-line bg-white p-3 text-xs leading-5 text-ink/65 lg:block">
            Document facts, impact, feedback, and next steps.
          </div>

          <form action={signOut} className="mt-5 hidden lg:block">
            <button className="focus-ring flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-ink/60 hover:bg-white hover:text-ink">
              <span className="truncate">{userEmail ?? "Signed in"}</span>
              <LogOut aria-hidden="true" className="h-4 w-4" />
            </button>
          </form>
        </div>
      </aside>

      <main className="px-4 py-6 lg:ml-72 lg:px-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
