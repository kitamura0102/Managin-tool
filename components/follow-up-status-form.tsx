import { CheckCircle2, RotateCcw } from "lucide-react";
import { updateFollowUpStatus } from "@/app/actions";
import type { FollowUpStatus } from "@/lib/types";

type FollowUpStatusFormProps = {
  id: string;
  status: FollowUpStatus;
};

export function FollowUpStatusForm({ id, status }: FollowUpStatusFormProps) {
  const nextStatus = status === "Open" ? "Done" : "Open";

  return (
    <form action={updateFollowUpStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={nextStatus} />
      <button className="focus-ring inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink hover:bg-paper">
        {status === "Open" ? (
          <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-sage" />
        ) : (
          <RotateCcw aria-hidden="true" className="h-4 w-4 text-clay" />
        )}
        {status === "Open" ? "Mark Done" : "Reopen"}
      </button>
    </form>
  );
}
