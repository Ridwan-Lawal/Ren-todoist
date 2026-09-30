"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DataGate } from "@/components/layout/data-gate";
import { DateShortcuts } from "@/components/task/date-shortcuts";
import { PRIORITY_LABELS } from "@/components/task/task-labels";
import { Button, buttonClasses } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useSafeAction } from "@/components/ui/notice";
import { EmptyState } from "@/components/ui/states";
import type { Project } from "@/lib/projects/project-types";
import {
  addSubtask,
  archiveTask,
  completeTask,
  deleteTask,
  removeSubtask,
  unarchiveTask,
  uncompleteTask,
  updateSubtask,
  updateTask,
} from "@/lib/tasks/task-service";
import { Task, TASK_PRIORITIES, TaskUpdates, TITLE_MAX_LENGTH } from "@/lib/tasks/task-types";
import { formatDateLabel, formatTime } from "@/lib/utils/dates";

export function TaskDetailsScreen({ id }: { id: string }) {
  return (
    <DataGate>
      {({ tasks, projects, today }) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) {
          return (
            <EmptyState
              title="This task is no longer available."
              action={
                <Link href="/" className={buttonClasses("secondary")}>
                  Back to Today
                </Link>
              }
            />
          );
        }
        return <TaskDetails task={task} projects={projects} today={today} />;
      }}
    </DataGate>
  );
}

function useSavedNote() {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return {
    visible,
    flash() {
      setVisible(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), 1800);
    },
  };
}

const fieldLabel = "text-sm font-medium text-muted";

function TaskDetails({ task, projects, today }: { task: Task; projects: Project[]; today: string }) {
  const router = useRouter();
  const safely = useSafeAction();
  const saved = useSavedNote();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const completed = task.status === "completed";
  const archived = task.status === "archived";

  const run = (action: () => unknown) => {
    if (safely(action) !== undefined) saved.flash();
  };
  const save = (updates: TaskUpdates) => run(() => updateTask(task.id, updates));

  return (
    <article>
      <Link href="/" className="-ml-2 mb-6 inline-flex min-h-11 items-center rounded-md px-2 text-sm text-muted hover:text-foreground">
        ← Today
      </Link>

      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="text-muted">
          {archived ? "Archived" : completed ? "Completed" : "Active"}
        </span>
        <span aria-live="polite" className={`text-muted transition-opacity duration-150 ${saved.visible ? "opacity-100" : "opacity-0"}`}>
          {saved.visible ? "Saved" : ""}
        </span>
      </div>

      <label htmlFor="task-title" className="sr-only">
        Title
      </label>
      <AutosaveTextarea
        id="task-title"
        value={task.title}
        singleLine
        maxLength={TITLE_MAX_LENGTH}
        onSave={(title) => {
          const trimmed = title.trim();
          if (!trimmed) return false; // empty title reverts
          if (trimmed !== task.title) save({ title: trimmed });
        }}
        className={`field-sizing-content w-full resize-none rounded-md bg-transparent text-[28px] font-semibold leading-tight tracking-tight focus:bg-surface ${
          completed ? "text-muted line-through" : ""
        }`}
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {!archived && (
          <Button
            variant={completed ? "secondary" : "primary"}
            onClick={() => run(() => (completed ? uncompleteTask(task.id) : completeTask(task.id)))}
          >
            {completed ? "Mark as not done" : "Complete"}
          </Button>
        )}
        <Button onClick={() => run(() => (archived ? unarchiveTask(task.id) : archiveTask(task.id)))}>
          {archived ? "Unarchive" : "Archive"}
        </Button>
        <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
          Delete
        </Button>
      </div>

      <dl className="mt-10 grid gap-8">
        <div>
          <dt className={fieldLabel}>Due</dt>
          <dd className="mt-2 flex flex-wrap items-center gap-2">
            <Button size="sm" aria-expanded={dateOpen} onClick={() => setDateOpen((open) => !open)}>
              {task.dueDate ? formatDateLabel(task.dueDate, today) : "No due date"}
            </Button>
            {task.dueDate && (
              <label className="flex items-center gap-2 text-sm text-muted">
                <span className="sr-only">Due time</span>
                <input
                  type="time"
                  value={task.dueTime ?? ""}
                  onChange={(event) => save({ dueTime: event.target.value || undefined })}
                  className="min-h-9 rounded-md border border-border bg-surface px-2 text-sm text-foreground"
                />
                {task.dueTime && <span className="sr-only">{formatTime(task.dueTime)}</span>}
              </label>
            )}
            {dateOpen && (
              <div className="animate-enter w-full max-w-xs rounded-lg border border-border bg-surface p-1">
                <DateShortcuts
                  today={today}
                  value={task.dueDate}
                  onSelect={(dueDate) => {
                    save({ dueDate });
                    setDateOpen(false);
                  }}
                />
              </div>
            )}
          </dd>
        </div>

        <div>
          <dt className={fieldLabel}>Priority</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {[...TASK_PRIORITIES].reverse().map((priority) => (
              <Button
                key={priority}
                size="sm"
                aria-pressed={task.priority === priority}
                onClick={() => save({ priority })}
              >
                {PRIORITY_LABELS[priority]}
              </Button>
            ))}
          </dd>
        </div>

        <div>
          <dt className={fieldLabel}>
            <label htmlFor="task-project">Project</label>
          </dt>
          <dd className="mt-2">
            {projects.length === 0 ? (
              <p className="text-sm text-muted">
                No projects yet.{" "}
                <Link href="/projects" className="text-accent underline-offset-2 hover:underline">
                  Create a project
                </Link>{" "}
                to group related tasks.
              </p>
            ) : (
              <select
                id="task-project"
                value={task.projectId ?? ""}
                onChange={(event) => save({ projectId: event.target.value || undefined })}
                className="min-h-11 w-full max-w-xs rounded-md border border-border bg-surface px-3 text-sm"
              >
                <option value="">No project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            )}
          </dd>
        </div>

        <div>
          <dt className={fieldLabel}>Tags</dt>
          <dd className="mt-2">
            <TagEditor tags={task.tags} onChange={(tags) => save({ tags })} />
          </dd>
        </div>

        <div>
          <dt className={fieldLabel}>
            <label htmlFor="task-notes">Notes</label>
          </dt>
          <dd className="mt-2">
            <AutosaveTextarea
              id="task-notes"
              value={task.notes ?? ""}
              placeholder="Add context that doesn't belong in the title"
              onSave={(notes) => {
                if ((notes || undefined) !== task.notes) save({ notes });
              }}
              className="field-sizing-content min-h-24 w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-[15px] leading-relaxed placeholder:text-muted"
            />
          </dd>
        </div>

        <div>
          <dt className={fieldLabel}>Subtasks</dt>
          <dd className="mt-2">
            <SubtaskEditor task={task} run={run} />
          </dd>
        </div>
      </dl>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this task?"
        description={`“${task.title}” will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete task"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          if (safely(() => (deleteTask(task.id), true))) router.push("/");
        }}
      />
    </article>
  );
}

/**
 * A textarea that saves on blur. While focused, the user's draft is never
 * replaced; when not focused, it follows the stored value (e.g. another tab).
 * `onSave` returning false reverts the draft to the stored value.
 */
function AutosaveTextarea({
  value,
  onSave,
  singleLine,
  ...props
}: Omit<React.ComponentProps<"textarea">, "value" | "onChange" | "onBlur"> & {
  value: string;
  onSave: (draft: string) => boolean | void;
  singleLine?: boolean;
}) {
  const [draft, setDraft] = useState(value);
  const [focused, setFocused] = useState(false);
  const shown = focused ? draft : value;

  return (
    <textarea
      {...props}
      rows={singleLine ? 1 : props.rows}
      value={shown}
      onFocus={() => {
        setDraft(value);
        setFocused(true);
      }}
      onChange={(event) => setDraft(singleLine ? event.target.value.replace(/\n/g, " ") : event.target.value)}
      onKeyDown={(event) => {
        if (singleLine && event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
      onBlur={() => {
        setFocused(false);
        onSave(draft);
      }}
    />
  );
}

function TagEditor({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    if (!draft.trim()) return;
    onChange([...tags, ...draft.split(/[\s,]+/)]);
    setDraft("");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span key={tag} className="inline-flex items-center rounded-full bg-subtle pl-3 text-sm text-muted">
          #{tag}
          <button
            type="button"
            aria-label={`Remove tag ${tag}`}
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="flex size-8 items-center justify-center rounded-full hover:text-foreground"
          >
            ×
          </button>
        </span>
      ))}
      <label className="sr-only" htmlFor="task-tag-input">
        Add tag
      </label>
      <input
        id="task-tag-input"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder={tags.length ? "Add tag" : "Add a tag, e.g. work"}
        className="min-h-9 min-w-32 flex-1 rounded-md border border-transparent bg-transparent px-2 text-sm placeholder:text-muted hover:border-border focus:border-border focus:bg-surface"
      />
    </div>
  );
}

function SubtaskEditor({ task, run }: { task: Task; run: (action: () => unknown) => void }) {
  const [draft, setDraft] = useState("");
  const done = task.subtasks.filter((s) => s.completed).length;

  return (
    <div>
      {task.subtasks.length > 0 && (
        <p className="mb-2 text-sm text-muted">
          {done} of {task.subtasks.length} done
        </p>
      )}
      <ul className="flex flex-col">
        {task.subtasks.map((subtask) => (
          <li key={subtask.id} className="group flex items-center gap-1">
            <button
              type="button"
              role="checkbox"
              aria-checked={subtask.completed}
              aria-label={subtask.completed ? `Mark “${subtask.title}” as not done` : `Complete “${subtask.title}”`}
              onClick={() => run(() => updateSubtask(task.id, subtask.id, { completed: !subtask.completed }))}
              className="-ml-3 flex size-11 shrink-0 items-center justify-center"
            >
              <span
                className={`size-4 rounded-full border-[1.5px] transition-colors duration-150 ${
                  subtask.completed ? "border-success bg-success" : "border-muted/60"
                }`}
              />
            </button>
            <label className="sr-only" htmlFor={`subtask-${subtask.id}`}>
              Subtask title
            </label>
            <input
              id={`subtask-${subtask.id}`}
              key={`${subtask.id}-${subtask.title}`}
              defaultValue={subtask.title}
              onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
              onBlur={(event) => {
                const title = event.target.value.trim();
                if (!title) event.target.value = subtask.title;
                else if (title !== subtask.title) run(() => updateSubtask(task.id, subtask.id, { title }));
              }}
              className={`min-h-9 min-w-0 flex-1 rounded-sm bg-transparent px-1 text-[15px] focus:bg-surface ${
                subtask.completed ? "text-muted line-through" : ""
              }`}
            />
            <button
              type="button"
              aria-label={`Delete subtask “${subtask.title}”`}
              onClick={() => run(() => removeSubtask(task.id, subtask.id))}
              className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted hover:bg-subtle hover:text-foreground md:size-9 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) return;
          run(() => addSubtask(task.id, draft));
          setDraft("");
        }}
        className="mt-1 flex items-center gap-2"
      >
        <label className="sr-only" htmlFor="new-subtask">
          Add subtask
        </label>
        <input
          id="new-subtask"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={TITLE_MAX_LENGTH}
          placeholder="+ Add subtask"
          className="min-h-11 min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 text-[15px] placeholder:text-muted hover:border-border focus:border-border focus:bg-surface"
        />
      </form>
    </div>
  );
}
