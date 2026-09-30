"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DataGate } from "@/components/layout/data-gate";
import { DateShortcuts } from "@/components/task/date-shortcuts";
import { PRIORITY_LABELS } from "@/components/task/task-labels";
import { BackLink } from "@/components/ui/back-link";
import { Button, buttonClasses } from "@/components/ui/button";
import { CheckCircle } from "@/components/ui/check-circle";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAnnounce, useSafeAction } from "@/components/ui/notice";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { EmptyState, GroupLabel } from "@/components/ui/states";
import { inputClasses } from "@/components/ui/styles";
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
import { formatDateLabel, toDateKey } from "@/lib/utils/dates";

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

function Property({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 py-2.5 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-4">
      <dt className="text-sm text-muted">{htmlFor ? <label htmlFor={htmlFor}>{label}</label> : label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

function TaskDetails({ task, projects, today }: { task: Task; projects: Project[]; today: string }) {
  const router = useRouter();
  const safely = useSafeAction();
  const announce = useAnnounce();
  const saved = useSavedNote();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const completed = task.status === "completed";
  const archived = task.status === "archived";

  const run = (action: () => unknown) => {
    if (safely(action) !== undefined) saved.flash();
  };
  const save = (updates: TaskUpdates) => run(() => updateTask(task.id, updates));

  const status = archived
    ? "Archived"
    : completed && task.completedAt
      ? `Completed · ${formatDateLabel(toDateKey(new Date(task.completedAt)), today)}`
      : null;

  return (
    <article>
      <div className="flex items-center justify-between">
        <BackLink href="/" />
        <span
          aria-live="polite"
          className={`mb-4 text-meta text-muted transition-opacity duration-300 md:mb-6 ${saved.visible ? "opacity-100" : "opacity-0"}`}
        >
          {saved.visible ? "Saved" : ""}
        </span>
      </div>

      <header className="flex items-start gap-1">
        <button
          type="button"
          role="checkbox"
          aria-checked={completed}
          aria-label={completed ? "Mark as not done" : "Complete task"}
          disabled={archived}
          onClick={() => {
            run(() => (completed ? uncompleteTask(task.id) : completeTask(task.id)));
            announce(completed ? "Marked as not done" : "Task completed");
          }}
          className="group/check -ml-3 flex size-11 shrink-0 items-center justify-center rounded-md disabled:opacity-40 md:mt-0.5"
        >
          <CheckCircle checked={completed} priority={task.priority} />
        </button>
        <div className="min-w-0 flex-1">
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
            className={`field-sizing-content -mx-1 w-full resize-none rounded-md bg-transparent px-1 py-0.5 text-page font-semibold transition-colors duration-150 hover:bg-subtle/70 focus:bg-surface ${
              completed ? "text-muted line-through decoration-muted/50" : ""
            }`}
          />
          {status && <p className="mt-1 text-sm text-muted">{status}</p>}
        </div>
      </header>

      <dl className="mt-8 divide-y divide-border/70 border-y border-border/70">
        <Property label="Due">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" aria-expanded={dateOpen} onClick={() => setDateOpen((open) => !open)}>
              <span className={task.dueDate && task.dueDate < today && !completed ? "text-danger" : ""}>
                {task.dueDate ? formatDateLabel(task.dueDate, today) : "No due date"}
              </span>
            </Button>
            {task.dueDate && (
              <label className="flex items-center">
                <span className="sr-only">Due time</span>
                <input
                  type="time"
                  value={task.dueTime ?? ""}
                  onChange={(event) => save({ dueTime: event.target.value || undefined })}
                  className={`${inputClasses} min-h-11 text-sm md:min-h-9`}
                />
              </label>
            )}
          </div>
          {dateOpen && (
            <div className="animate-enter mt-2 w-full max-w-xs rounded-lg border border-border bg-surface p-1 shadow-popover">
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
        </Property>

        <Property label="Priority">
          <SegmentedControl
            label="Priority"
            value={task.priority}
            onChange={(priority) => save({ priority })}
            options={[...TASK_PRIORITIES].map((priority) => ({
              value: priority,
              label: priority === "none" ? "None" : PRIORITY_LABELS[priority],
            }))}
          />
        </Property>

        <Property label="Project" htmlFor={projects.length ? "task-project" : undefined}>
          {projects.length === 0 ? (
            <p className="text-sm text-muted">
              No projects yet.{" "}
              <Link href="/projects" className="text-accent underline-offset-2 hover:underline">
                Create one
              </Link>
            </p>
          ) : (
            <select
              id="task-project"
              value={task.projectId ?? ""}
              onChange={(event) => save({ projectId: event.target.value || undefined })}
              className={`${inputClasses} min-h-11 w-full max-w-xs text-sm md:min-h-9`}
            >
              <option value="">No project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          )}
        </Property>

        <Property label="Tags">
          <TagEditor tags={task.tags} onChange={(tags) => save({ tags })} />
        </Property>
      </dl>

      <section className="mt-10">
        <GroupLabel>
          <label htmlFor="task-notes">Notes</label>
        </GroupLabel>
        <AutosaveTextarea
          id="task-notes"
          value={task.notes ?? ""}
          placeholder="Add context that doesn't belong in the title"
          onSave={(notes) => {
            if ((notes || undefined) !== task.notes) save({ notes });
          }}
          className={`${inputClasses} field-sizing-content mt-2 min-h-28 w-full resize-none py-2.5 leading-relaxed`}
        />
      </section>

      <section className="mt-10">
        <GroupLabel>Subtasks</GroupLabel>
        <div className="mt-2">
          <SubtaskEditor task={task} run={run} />
        </div>
      </section>

      <footer className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6">
        <Button variant="ghost" size="sm" onClick={() => run(() => (archived ? unarchiveTask(task.id) : archiveTask(task.id)))}>
          {archived ? "Unarchive" : "Archive"}
        </Button>
        <Button variant="ghost-destructive" size="sm" onClick={() => setConfirmDelete(true)}>
          Delete
        </Button>
      </footer>

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
            className="flex size-8 items-center justify-center rounded-full transition-colors duration-150 hover:bg-border/60 hover:text-foreground"
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
        <p className="mb-1 text-meta text-muted">
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
              className="group/check -ml-3 flex size-11 shrink-0 items-center justify-center"
            >
              <CheckCircle checked={subtask.completed} size="sm" />
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
              className={`min-h-9 min-w-0 flex-1 rounded-sm bg-transparent px-1 text-body focus:bg-surface ${
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
          className="-ml-1 min-h-11 min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 text-body placeholder:text-muted hover:border-border focus:border-border focus:bg-surface"
        />
      </form>
    </div>
  );
}
