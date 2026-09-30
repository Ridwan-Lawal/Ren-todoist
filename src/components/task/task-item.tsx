"use client";

import Link from "next/link";
import { useSafeAction } from "@/components/ui/notice";
import type { Project } from "@/lib/projects/project-types";
import { completeTask, uncompleteTask } from "@/lib/tasks/task-service";
import type { Task } from "@/lib/tasks/task-types";
import { formatDateLabel, formatTime } from "@/lib/utils/dates";
import { PRIORITY_LABELS, PRIORITY_TONE } from "./task-labels";
import { TaskMenu } from "./task-menu";

type TaskItemProps = {
  task: Task;
  today: string;
  projects: Project[];
  /** Hide the project name, e.g. inside that project's own page. */
  hideProject?: boolean;
  /** Hide the date, e.g. inside an Upcoming day group that already names it. */
  hideDate?: boolean;
};

export function TaskItem({ task, today, projects, hideProject, hideDate }: TaskItemProps) {
  const safely = useSafeAction();
  const completed = task.status === "completed";
  const archived = task.status === "archived";
  const overdue = task.status === "active" && !!task.dueDate && task.dueDate < today;
  const project = task.projectId ? projects.find((p) => p.id === task.projectId) : undefined;
  const doneSubtasks = task.subtasks.filter((s) => s.completed).length;

  const meta: { key: string; node: React.ReactNode }[] = [];
  if (task.dueDate && !hideDate) {
    const label = formatDateLabel(task.dueDate, today);
    meta.push({
      key: "date",
      node: <span className={overdue ? "text-danger" : ""}>{overdue ? `Overdue · ${label}` : label}</span>,
    });
  }
  if (task.dueTime) meta.push({ key: "time", node: formatTime(task.dueTime) });
  if (project && !hideProject) meta.push({ key: "project", node: project.name });
  if (task.priority !== "none") {
    meta.push({ key: "priority", node: <span className={PRIORITY_TONE[task.priority]}>{PRIORITY_LABELS[task.priority]}</span> });
  }
  if (task.subtasks.length) meta.push({ key: "subtasks", node: `${doneSubtasks}/${task.subtasks.length}` });
  if (task.tags.length) meta.push({ key: "tags", node: task.tags.map((tag) => `#${tag}`).join(" ") });
  if (archived) meta.push({ key: "archived", node: "Archived" });

  const toggle = () =>
    safely(() => (completed ? uncompleteTask(task.id) : completeTask(task.id)), "We couldn't save this task. Try again.");

  return (
    <li className="group animate-enter flex items-start gap-1 border-b border-border/70 py-1 last:border-b-0">
      <button
        type="button"
        role="checkbox"
        aria-checked={completed}
        aria-label={completed ? `Mark “${task.title}” as not done` : `Complete “${task.title}”`}
        disabled={archived}
        onClick={toggle}
        className="-ml-3 flex size-11 shrink-0 items-center justify-center rounded-md disabled:opacity-40"
      >
        <span
          className={`flex size-5 items-center justify-center rounded-full border-[1.5px] transition-colors duration-150 ${
            completed ? "border-success bg-success text-white" : "border-muted/60 group-hover:border-foreground"
          }`}
        >
          {completed && (
            <svg aria-hidden viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </button>

      <Link href={`/tasks/${task.id}`} className="min-w-0 flex-1 rounded-sm py-2.5">
        <span
          className={`block break-words text-[15px] font-medium leading-snug ${
            completed ? "text-muted line-through decoration-muted/60" : ""
          }`}
        >
          {task.title}
        </span>
        {meta.length > 0 && (
          <span className="mt-1 flex flex-wrap gap-x-1.5 text-[13px] text-muted">
            {meta.map((item, i) => (
              <span key={item.key} className="break-all">
                {i > 0 && <span aria-hidden className="mr-1.5">·</span>}
                {item.node}
              </span>
            ))}
          </span>
        )}
      </Link>

      <TaskMenu task={task} today={today} projects={projects} />
    </li>
  );
}

export function TaskList({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <ul aria-label={label} className="flex flex-col">
      {children}
    </ul>
  );
}
