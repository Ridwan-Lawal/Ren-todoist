import { addDays, toDateKey } from "@/lib/utils/dates";
import { Task, TaskPriority, TaskStatus } from "./task-types";

const PRIORITY_RANK: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2, none: 3 };

/** Priority (high first), then due time (timed first, earliest first), then oldest first. */
export function compareByAttention(a: Task, b: Task): number {
  return (
    PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
    (a.dueTime ?? "99:99").localeCompare(b.dueTime ?? "99:99") ||
    a.createdAt.localeCompare(b.createdAt)
  );
}

const active = (tasks: Task[]) => tasks.filter((task) => task.status === "active");

export type TodayView = { overdue: Task[]; dueToday: Task[]; undated: Task[] };

export function getTodayView(tasks: Task[], today: string): TodayView {
  const view: TodayView = { overdue: [], dueToday: [], undated: [] };
  for (const task of active(tasks)) {
    if (!task.dueDate) view.undated.push(task);
    else if (task.dueDate < today) view.overdue.push(task);
    else if (task.dueDate === today) view.dueToday.push(task);
  }
  view.overdue.sort((a, b) => a.dueDate!.localeCompare(b.dueDate!) || compareByAttention(a, b));
  view.dueToday.sort(compareByAttention);
  view.undated.sort(compareByAttention);
  return view;
}

export const UPCOMING_DAYS = 7;

export function getUpcoming(tasks: Task[], today: string): { date: string; tasks: Task[] }[] {
  const last = addDays(today, UPCOMING_DAYS);
  const byDate = new Map<string, Task[]>();
  for (const task of active(tasks)) {
    if (task.dueDate && task.dueDate > today && task.dueDate <= last) {
      byDate.set(task.dueDate, [...(byDate.get(task.dueDate) ?? []), task]);
    }
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayTasks]) => ({ date, tasks: dayTasks.sort(compareByAttention) }));
}

export function getCompletedToday(tasks: Task[], today: string): Task[] {
  return tasks
    .filter((task) => task.status === "completed" && task.completedAt && toDateKey(new Date(task.completedAt)) === today)
    .sort((a, b) => b.completedAt!.localeCompare(a.completedAt!));
}

export type DueFilter = "overdue" | "today" | "upcoming" | "none";

export type TaskFilters = {
  status: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  tag?: string;
  due?: DueFilter;
};

function matchesDue(task: Task, due: DueFilter, today: string): boolean {
  switch (due) {
    case "none":
      return !task.dueDate;
    case "overdue":
      return !!task.dueDate && task.dueDate < today;
    case "today":
      return task.dueDate === today;
    case "upcoming":
      return !!task.dueDate && task.dueDate > today && task.dueDate <= addDays(today, UPCOMING_DAYS);
  }
}

export function filterTasks(tasks: Task[], filters: TaskFilters, today: string): Task[] {
  return tasks.filter(
    (task) =>
      task.status === filters.status &&
      (!filters.priority || task.priority === filters.priority) &&
      (!filters.projectId || task.projectId === filters.projectId) &&
      (!filters.tag || task.tags.includes(filters.tag)) &&
      (!filters.due || matchesDue(task, filters.due, today)),
  );
}

export type TaskSort = "dueDate" | "priority" | "created" | "title";

const SORTERS: Record<TaskSort, (a: Task, b: Task) => number> = {
  dueDate: (a, b) =>
    (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999") || compareByAttention(a, b),
  priority: compareByAttention,
  created: (a, b) => b.createdAt.localeCompare(a.createdAt),
  title: (a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
};

export function sortTasks(tasks: Task[], sort: TaskSort): Task[] {
  return [...tasks].sort(SORTERS[sort]);
}

export function countActiveTasksByProject(tasks: Task[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const task of active(tasks)) {
    if (task.projectId) counts[task.projectId] = (counts[task.projectId] ?? 0) + 1;
  }
  return counts;
}

export function collectTags(tasks: Task[]): string[] {
  return [...new Set(tasks.flatMap((task) => task.tags))].sort();
}
