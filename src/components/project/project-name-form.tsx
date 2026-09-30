"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSafeAction } from "@/components/ui/notice";
import { ProjectValidationError } from "@/lib/projects/project-service";

const MESSAGES: Record<ProjectValidationError["reason"], string> = {
  "empty-name": "Give the project a name.",
  "duplicate-name": "A project with this name already exists.",
  "not-found": "This project is no longer available.",
};

/** Name input used to create and to rename a project; shows validation inline. */
export function ProjectNameForm({
  id,
  initialName = "",
  submitLabel,
  onSubmit,
  onCancel,
}: {
  id: string;
  initialName?: string;
  submitLabel: string;
  onSubmit: (name: string) => unknown;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const safely = useSafeAction();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      if (safely(() => onSubmit(name), "We couldn't save this project. Try again.") !== undefined) {
        setName(initialName);
        setError(null);
      }
    } catch (err) {
      if (err instanceof ProjectValidationError) setError(MESSAGES[err.reason]);
      else throw err;
    }
  }

  return (
    <form onSubmit={submit} onKeyDown={(event) => event.key === "Escape" && onCancel?.()}>
      <div className="flex flex-wrap gap-2">
        <label htmlFor={id} className="sr-only">
          Project name
        </label>
        <input
          id={id}
          value={name}
          autoFocus={!!onCancel}
          onChange={(event) => {
            setName(event.target.value);
            setError(null);
          }}
          placeholder="Project name"
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-error`}
          className="min-h-11 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 text-[15px] placeholder:text-muted"
        />
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
      </div>
      <p id={`${id}-error`} aria-live="polite" className="mt-2 min-h-5 text-[13px] text-danger">
        {error}
      </p>
    </form>
  );
}
