import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary";
};

export function ButtonLink({ className, variant = "primary", ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
        variant === "primary"
          ? "bg-ink text-white hover:bg-ink/90"
          : "border border-line bg-white text-ink hover:bg-paper",
        className
      )}
      {...props}
    />
  );
}
