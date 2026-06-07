import { format, isBefore, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { clsx, type ClassValue } from "clsx";

export function cn(...values: ClassValue[]) {
  return clsx(values);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "Not set";
  return format(parseISO(value), "MMM d, yyyy");
}

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function fridayWeekRange() {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  return {
    start: format(weekStart, "yyyy-MM-dd"),
    end: format(weekEnd, "yyyy-MM-dd")
  };
}

export function isOverdue(value: string) {
  return isBefore(parseISO(value), parseISO(todayISO()));
}

export function compactCountLabel(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
