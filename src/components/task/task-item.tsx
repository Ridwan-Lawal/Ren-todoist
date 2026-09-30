"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CheckCircle } from "@/components/ui/check-circle";
import { useAnnounce, useSafeAction } from "@/components/ui/notice";
import type { Project } from "@/lib/projects/project-types";
import { completeTask, uncompleteTask } from "@/lib/tasks/task-service";
import type { Task } from "@/lib/tasks/task-types";
import { formatDateLabel, formatTime } from "@/lib/utils/dates";
import { PRIORITY_SHORT_LABELS } from "./task-labels";
import { TaskMenu } from "./task-menu";

/** How long a just-checked task stays in place before moving to Completed. */
const COMPLETION_HOLD_MS = 600;

type TaskItemProps = {
  task: Task;
  today: string;
  projects: Project[];
  /** Hide the project name, e.g. inside that project's own page. */
  hideProject?: boolean;
  /** Hide the date, e.g. inside an Upcoming day group that already names it. */
  hideDate?: boolean;
  /** Drop the "Overdue ·" prefix where a heading already says so. */
  hideOverdueLabel?: boolean;
};

/**
 * Checking a task shows it done immediately, then saves after a short hold so
 * the user sees what happened before it moves. Checking again during the hold
 * cancels it; leaving the page during the hold saves right away.
 */
function useCompletionHold(task: Task) {
  const safely = useSafeAction();
  const announce = useAnnounce();
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pending = useRef(false);

  const commit = () => {
    clearTimeout(timer.current);
    if (!pending.current) return;
    pending.current = false;
    safely(() => completeTask(task.id), "We couldn't save this task. Try again.");
    setHolding(false);
  };
  const commitRef = useRef(commit);
  useEffect(() => {
    commitRef.current = commit;
  });

  useEffect(() => {
    const flush = () => commitRef.current();
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, []);

  function toggle() {
    if (task.status === "completed") {
      safely(() => uncompleteTask(task.id), "We couldn't save this task. Try again.");
      announce(`Marked “${task.title}” as not done`);
    } else if (pending.current) {
      pending.current = false;
      clearTimeout(timer.current);
      setHolding(false);
      announce(`“${task.title}” is still open`);
    } else {
      pending.current = true;
      setHolding(true);
      announce(`Completed “${task.title}”`);
      timer.current = setTimeout(() => commitRef.current(), COMPLETION_HOLD_MS);
    }
  }

  return { checked: task.status === "completed" || holding, holding, toggle };
}

export function TaskItem({ task, today, projects, hideProject, hideDate, hideOverdueLabel }: TaskItemProps) {
  const { checked, holding, toggle } = useCompletionHold(task);
  const archived = task.status === "archived";
  const overdue = task.status === "active" && !!task.dueDate && task.dueDate < today;
  const project = task.projectId ? projects.find((p) => p.id === task.projectId) : undefined;
  const doneSubtasks = task.subtasks.filter((s) => s.completed).length;

  const meta: { key: string; node: React.ReactNode; className?: string }[] = [];
  if (task.dueDate && !hideDate) {
    const label = formatDateLabel(task.dueDate, today);
    meta.push({
      key: "date",
      node: overdue && !hideOverdueLabel ? `Overdue · ${label}` : label,
      className: overdue && !checked ? "text-danger" : undefined,
    });
  }
  if (task.dueTime) meta.push({ key: "time", node: formatTime(task.dueTime) });
  if (project && !hideProject) meta.push({ key: "project", node: project.name });
  if (task.priority !== "none") meta.push({ key: "priority", node: PRIORITY_SHORT_LABELS[task.priority] });
  if (task.subtasks.length) {
    meta.push({
      key: "subtasks",
      node: (
        <>
          {doneSubtasks}/{task.subtasks.length}
          <span className="sr-only"> subtasks done</span>
        </>
      ),
    });
  }
  for (const tag of task.tags) meta.push({ key: `tag-${tag}`, node: `#${tag}` });
  if (archived) meta.push({ key: "archived", node: "Archived" });

  return (
    <li
      className={`group animate-enter relative -mx-2 flex items-start rounded-md px-2 transition-[background-color,opacity] duration-150 hover:bg-subtle/70 focus-within:bg-subtle/70 ${
        holding ? "opacity-70" : ""
      }`}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={checked ? `Mark “${task.title}” as not done` : `Complete “${task.title}”`}
        disabled={archived}
        onClick={toggle}
        className="group/check -ml-3 flex size-11 shrink-0 items-center justify-center rounded-md disabled:opacity-40"
      >
        <CheckCircle checked={checked} priority={task.priority} />
      </button>

      <Link href={`/tasks/${task.id}`} className="min-w-0 flex-1 rounded-sm py-3 focus-visible:outline-offset-4">
        <span
          className={`block break-words text-title font-medium transition-colors duration-150 ${
            checked ? "text-muted line-through decoration-muted/50" : ""
          }`}
        >
          {task.title}
        </span>
        {meta.length > 0 && (
          <span className="mt-0.5 flex flex-wrap gap-y-0.5 text-meta text-muted">
            {meta.map((item, i) => (
              <span
                key={item.key}
                className={`break-all ${item.className ?? ""} ${
                  i < meta.length - 1 ? "after:mx-1.5 after:text-muted/60 after:content-['·']" : ""
                }`}
              >
                {item.node}
              </span>
            ))}
          </span>
        )}
      </Link>

      <div className="pt-0.5">
        <TaskMenu task={task} today={today} projects={projects} />
      </div>
    </li>
  );
}

export function TaskList({ children, label, labelledBy }: { children: React.ReactNode; label?: string; labelledBy?: string }) {
  return (
    <ul aria-label={label} aria-labelledby={labelledBy} className="flex flex-col gap-px">
      {children}
    </ul>
  );
}
