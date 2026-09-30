import type { TaskPriority } from "@/lib/tasks/task-types";

const RING: Record<TaskPriority, string> = {
  high: "border-danger border-2",
  medium: "border-warning border-2",
  low: "border-muted/60 border-[1.5px]",
  none: "border-muted/60 border-[1.5px]",
};

/**
 * The visual circle for task and subtask checkboxes. Priority is shown by the
 * ring; the accessible name and a text label elsewhere carry the meaning too.
 */
export function CheckCircle({
  checked,
  priority = "none",
  size = "md",
}: {
  checked: boolean;
  priority?: TaskPriority;
  size?: "md" | "sm";
}) {
  const dimension = size === "md" ? "size-5" : "size-4";
  return (
    <span
      aria-hidden
      className={`flex ${dimension} shrink-0 items-center justify-center rounded-full transition-colors duration-150 ${
        checked ? "border-[1.5px] border-muted bg-muted text-background" : `${RING[priority]} group-hover/check:bg-subtle`
      }`}
    >
      {checked && (
        <svg viewBox="0 0 16 16" className={size === "md" ? "size-3" : "size-2.5"} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path className="animate-draw" d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}
