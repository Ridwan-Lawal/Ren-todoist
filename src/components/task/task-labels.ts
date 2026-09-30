import type { TaskPriority } from "@/lib/tasks/task-types";

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
  none: "No priority",
};

/** Compact labels for task metadata; the checkbox ring shows the same priority visually. */
export const PRIORITY_SHORT_LABELS: Record<TaskPriority, string> = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
  none: "",
};
