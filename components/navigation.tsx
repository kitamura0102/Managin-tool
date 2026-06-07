"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  ClipboardPenLine,
  Home,
  NotebookPen,
  Settings,
  UserRound
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/employees", label: "Employees", icon: UserRound },
  { href: "/notes/new", label: "Add Note", icon: NotebookPen, primary: true },
  { href: "/weekly-review", label: "Weekly Review", icon: ClipboardPenLine },
  { href: "/follow-ups", label: "Follow-ups", icon: CalendarCheck },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "focus-ring flex min-w-max items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-ink text-white"
                : "text-ink/70 hover:bg-white hover:text-ink",
              link.primary && !active ? "border border-sage/25 bg-sage/10 text-sage" : ""
            )}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
