import type { TaskPriority } from "@/lib/tasks/task-types";

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
  none: "No priority",
};

/** Subtle text colour per priority; the label text always carries the meaning too. */
export const PRIORITY_TONE: Record<TaskPriority, string> = {
  high: "text-danger",
  medium: "text-warning",
  low: "text-muted",
  none: "text-muted",
};
