"use client";

import { useState } from "react";
import { parseTaskInput } from "@/lib/parser/task-parser";
import type { Project } from "@/lib/projects/project-types";
import { StorageError } from "@/lib/storage/local-storage";
import { captureTask } from "@/lib/tasks/capture";
import { TITLE_MAX_LENGTH } from "@/lib/tasks/task-types";
import { formatDateLabel, formatTime } from "@/lib/utils/dates";
import { PRIORITY_LABELS } from "@/components/task/task-labels";

export const QUICK_CAPTURE_ID = "quick-capture";

/** Moves focus to the Quick Capture input on the current page. */
export function focusQuickCapture() {
  document.getElementById(QUICK_CAPTURE_ID)?.focus();
}

type QuickCaptureProps = {
  today: string;
  projects: Project[];
  /** Tasks captured here are assigned to this project unless the input names another. */
  defaultProjectId?: string;
  placeholder?: string;
};

export function QuickCapture({
  today,
  projects,
  defaultProjectId,
  placeholder = "What needs to get done?",
}: QuickCaptureProps) {
  const [value, setValue] = useState("");
  const [ignoreParsing, setIgnoreParsing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const parsed = parseTaskInput(value, { today, projects });
  const details = [
    parsed.dueDate && formatDateLabel(parsed.dueDate, today),
    parsed.dueTime && formatTime(parsed.dueTime),
    parsed.projectName,
    parsed.priority && PRIORITY_LABELS[parsed.priority],
    ...(parsed.tags ?? []).map((tag) => `#${tag}`),
  ].filter(Boolean);
  const showPreview = details.length > 0 && !ignoreParsing;
  const tooLong = (ignoreParsing ? value.trim() : parsed.title).length > TITLE_MAX_LENGTH;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!value.trim()) {
      setMessage("Type a task first.");
      return;
    }
    if (tooLong) {
      setMessage(`Keep titles under ${TITLE_MAX_LENGTH} characters. Longer detail fits in notes.`);
      return;
    }
    try {
      captureTask(value, { today, projects, ignoreParsing, defaultProjectId });
      setValue("");
      setIgnoreParsing(false);
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof StorageError ? "We couldn't save this task. Try again." : "Type a task first.");
    }
  }

  return (
    <form onSubmit={submit} className="mb-6">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 transition-colors duration-150 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15">
        <span aria-hidden className="text-xl leading-none text-muted">
          +
        </span>
        <label htmlFor={QUICK_CAPTURE_ID} className="sr-only">
          Capture a task
        </label>
        <input
          id={QUICK_CAPTURE_ID}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (message) setMessage(null);
            if (!event.target.value) setIgnoreParsing(false);
          }}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="done"
          aria-describedby={`${QUICK_CAPTURE_ID}-hint`}
          aria-invalid={message ? true : undefined}
          className="min-h-14 min-w-0 flex-1 bg-transparent text-base placeholder:text-muted focus:outline-none focus-visible:outline-none"
        />
        <button
          type="submit"
          aria-label="Add task"
          className="-mr-2 flex size-11 shrink-0 items-center justify-center rounded-md text-muted hover:bg-subtle hover:text-foreground"
        >
          <span aria-hidden>↵</span>
        </button>
      </div>

      <div id={`${QUICK_CAPTURE_ID}-hint`} aria-live="polite" className="mt-2 min-h-6 px-1 text-[13px]">
        {message ? (
          <p className="text-danger">{message}</p>
        ) : showPreview ? (
          <p className="flex items-center gap-2 text-muted">
            <span>
              <span className="sr-only">Detected: </span>
              {details.join(" · ")}
            </span>
            <button
              type="button"
              onClick={() => setIgnoreParsing(true)}
              aria-label="Ignore detected details and use the exact text"
              className="flex size-6 items-center justify-center rounded-sm hover:bg-subtle hover:text-foreground"
            >
              ×
            </button>
          </p>
        ) : ignoreParsing && details.length > 0 ? (
          <p className="text-muted">Saving your exact text.</p>
        ) : null}
      </div>
    </form>
  );
}
