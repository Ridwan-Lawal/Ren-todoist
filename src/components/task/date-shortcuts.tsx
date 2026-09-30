"use client";

import { addDays, nextWeek, thisWeekend } from "@/lib/utils/dates";

export function dateShortcuts(today: string) {
  return [
    { label: "Today", date: today },
    { label: "Tomorrow", date: addDays(today, 1) },
    { label: "This weekend", date: thisWeekend(today) },
    { label: "Next week", date: nextWeek(today) },
  ];
}

/** Shared due-date picker used by the task menu and Task Details. */
export function DateShortcuts({
  today,
  value,
  onSelect,
}: {
  today: string;
  value?: string;
  onSelect: (date: string | undefined) => void;
}) {
  const item =
    "flex min-h-11 w-full items-center justify-between rounded-sm px-3 text-left text-sm hover:bg-subtle md:min-h-9";
  return (
    <div className="flex flex-col">
      {dateShortcuts(today).map((shortcut) => (
        <button
          key={shortcut.label}
          type="button"
          className={`${item} ${value === shortcut.date ? "font-medium text-accent" : ""}`}
          onClick={() => onSelect(shortcut.date)}
        >
          {shortcut.label}
        </button>
      ))}
      <label className={`${item} gap-3`}>
        <span>Custom date</span>
        <input
          type="date"
          value={value ?? ""}
          onChange={(event) => event.target.value && onSelect(event.target.value)}
          className="rounded-sm border border-border bg-surface px-2 py-1 text-sm text-foreground"
        />
      </label>
      {value && (
        <button type="button" className={`${item} text-muted`} onClick={() => onSelect(undefined)}>
          Remove due date
        </button>
      )}
    </div>
  );
}
