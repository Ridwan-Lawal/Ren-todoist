/** Dates are stored as local `YYYY-MM-DD` keys, which sort chronologically as strings. */

const pad = (n: number) => String(n).padStart(2, "0");

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(key: string, days: number): string {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

/** 0 = Sunday … 6 = Saturday */
export function weekdayOf(key: string): number {
  return fromDateKey(key).getDay();
}

/** The next date (including `from`) that falls on `weekday`. */
export function nextWeekday(from: string, weekday: number): string {
  return addDays(from, (weekday - weekdayOf(from) + 7) % 7);
}

/** Human label relative to today: "Today", "Tomorrow", "Yesterday", "Fri", "Oct 4". */
export function formatDateLabel(key: string, today: string): string {
  if (key === today) return "Today";
  if (key === addDays(today, 1)) return "Tomorrow";
  if (key === addDays(today, -1)) return "Yesterday";
  const date = fromDateKey(key);
  if (key > today && key <= addDays(today, 6)) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  const sameYear = key.slice(0, 4) === today.slice(0, 4);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

/** "15:00" → "3:00 PM" */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${pad(minutes)} ${suffix}`;
}

/** "This weekend": today if it is already the weekend, otherwise the coming Saturday. */
export function thisWeekend(today: string): string {
  const weekday = weekdayOf(today);
  return weekday === 0 || weekday === 6 ? today : nextWeekday(today, 6);
}

/** "Next week": the next Monday after today. */
export function nextWeek(today: string): string {
  return nextWeekday(addDays(today, 1), 1);
}
