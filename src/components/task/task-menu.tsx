"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { menuItemClasses } from "@/components/ui/styles";
import { useSafeAction } from "@/components/ui/notice";
import type { Project } from "@/lib/projects/project-types";
import {
  archiveTask,
  deleteTask,
  rescheduleTask,
  unarchiveTask,
  updateTask,
} from "@/lib/tasks/task-service";
import { Task, TASK_PRIORITIES } from "@/lib/tasks/task-types";
import { DateShortcuts } from "./date-shortcuts";
import { PRIORITY_LABELS } from "./task-labels";

type View = "main" | "reschedule" | "priority" | "project";

const itemClass = menuItemClasses;

export function TaskMenu({ task, today, projects }: { task: Task; today: string; projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("main");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const safely = useSafeAction();

  const close = (returnFocus = true) => {
    setOpen(false);
    setView("main");
    if (returnFocus) trigger.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) close(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    wrapper.current?.querySelector<HTMLElement>("[data-menu-panel] button, [data-menu-panel] a")?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, view]);

  const act = (action: () => unknown) => {
    safely(action);
    close();
  };

  return (
    <div ref={wrapper} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-label={`More actions for “${task.title}”`}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => (open ? close() : setOpen(true))}
        className="flex size-11 items-center justify-center rounded-md text-muted/70 transition-[opacity,background-color,color] duration-150 hover:bg-border/60 hover:text-foreground aria-expanded:bg-border/60 aria-expanded:text-foreground md:size-9 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:aria-expanded:opacity-100"
      >
        <svg aria-hidden viewBox="0 0 20 20" className="size-5" fill="currentColor">
          <circle cx="4" cy="10" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="16" cy="10" r="1.5" />
        </svg>
      </button>

      {open && (
        <div
          id={panelId}
          data-menu-panel
          className="animate-enter absolute right-0 top-full z-30 mt-1 w-64 origin-top-right rounded-lg border border-border bg-surface p-1 shadow-popover"
        >
          {view !== "main" && (
            <button type="button" className={`${itemClass} text-muted`} onClick={() => setView("main")}>
              ← Back
            </button>
          )}

          {view === "main" && (
            <>
              <Link href={`/tasks/${task.id}`} className={itemClass}>
                Edit
              </Link>
              <button type="button" className={itemClass} onClick={() => setView("reschedule")}>
                Reschedule
              </button>
              <button type="button" className={itemClass} onClick={() => setView("priority")}>
                Change priority
              </button>
              <button type="button" className={itemClass} onClick={() => setView("project")}>
                Move to project
              </button>
              {task.status === "archived" ? (
                <button type="button" className={itemClass} onClick={() => act(() => unarchiveTask(task.id))}>
                  Unarchive
                </button>
              ) : (
                <button type="button" className={itemClass} onClick={() => act(() => archiveTask(task.id))}>
                  Archive
                </button>
              )}
              <div role="separator" className="my-1 h-px bg-border" />
              <button
                type="button"
                className={`${itemClass} text-danger`}
                onClick={() => {
                  close(false);
                  setConfirmDelete(true);
                }}
              >
                Delete
              </button>
            </>
          )}

          {view === "reschedule" && (
            <DateShortcuts
              today={today}
              value={task.dueDate}
              onSelect={(date) => act(() => rescheduleTask(task.id, date))}
            />
          )}

          {view === "priority" &&
            [...TASK_PRIORITIES].reverse().map((priority) => (
              <button
                key={priority}
                type="button"
                aria-pressed={task.priority === priority}
                className={`${itemClass} ${task.priority === priority ? "font-medium text-accent" : ""}`}
                onClick={() => act(() => updateTask(task.id, { priority }))}
              >
                {PRIORITY_LABELS[priority]}
              </button>
            ))}

          {view === "project" && (
            <>
              {projects.length === 0 && (
                <p className="px-3 py-2 text-sm text-muted">
                  No projects yet.{" "}
                  <Link href="/projects" className="text-accent underline-offset-2 hover:underline">
                    Create one
                  </Link>
                </p>
              )}
              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  aria-pressed={task.projectId === project.id}
                  className={`${itemClass} ${task.projectId === project.id ? "font-medium text-accent" : ""}`}
                  onClick={() => act(() => updateTask(task.id, { projectId: project.id }))}
                >
                  <span className="truncate">{project.name}</span>
                </button>
              ))}
              {task.projectId && (
                <button
                  type="button"
                  className={`${itemClass} text-muted`}
                  onClick={() => act(() => updateTask(task.id, { projectId: undefined }))}
                >
                  Remove from project
                </button>
              )}
            </>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this task?"
        description={`“${task.title}” will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete task"
        onCancel={() => {
          setConfirmDelete(false);
          trigger.current?.focus();
        }}
        onConfirm={() => {
          setConfirmDelete(false);
          safely(() => deleteTask(task.id));
        }}
      />
    </div>
  );
}
