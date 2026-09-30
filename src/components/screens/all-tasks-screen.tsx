"use client";

import { useState } from "react";
import { DataGate } from "@/components/layout/data-gate";
import { PRIORITY_LABELS } from "@/components/task/task-labels";
import { TaskItem, TaskList } from "@/components/task/task-item";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/states";
import { TASK_PRIORITIES, TaskPriority, TaskStatus } from "@/lib/tasks/task-types";
import { collectTags, DueFilter, filterTasks, sortTasks, TaskFilters, TaskSort } from "@/lib/tasks/task-views";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

const DUE_OPTIONS: { value: DueFilter; label: string }[] = [
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Next 7 days" },
  { value: "none", label: "No due date" },
];

const SORT_OPTIONS: { value: TaskSort; label: string }[] = [
  { value: "dueDate", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "created", label: "Newest first" },
  { value: "title", label: "Alphabetical" },
];

const DEFAULT_FILTERS: TaskFilters = { status: "active" };

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-[13px] text-muted">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-md border border-border bg-surface px-2 text-sm text-foreground md:min-h-9"
      >
        {children}
      </select>
    </label>
  );
}

export function AllTasksScreen() {
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<TaskSort>("dueDate");
  const set = (patch: Partial<TaskFilters>) => setFilters((current) => ({ ...current, ...patch }));
  const filtered =
    filters.priority || filters.projectId || filters.tag || filters.due || filters.status !== "active";

  return (
    <DataGate>
      {({ tasks, projects, today }) => {
        const visible = sortTasks(filterTasks(tasks, filters, today), sort);
        const tags = collectTags(tasks);
        return (
          <>
            <PageHeader title="All Tasks" subtitle={`${visible.length} ${visible.length === 1 ? "task" : "tasks"}`} />

            <div role="group" aria-label="Filter and sort" className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Select label="Status" value={filters.status} onChange={(v) => set({ status: v as TaskStatus })}>
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Priority"
                value={filters.priority ?? ""}
                onChange={(v) => set({ priority: (v || undefined) as TaskPriority | undefined })}
              >
                <option value="">Any</option>
                {[...TASK_PRIORITIES].reverse().map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </Select>
              <Select label="Project" value={filters.projectId ?? ""} onChange={(v) => set({ projectId: v || undefined })}>
                <option value="">Any</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
              <Select label="Tag" value={filters.tag ?? ""} onChange={(v) => set({ tag: v || undefined })}>
                <option value="">Any</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    #{tag}
                  </option>
                ))}
              </Select>
              <Select
                label="Due"
                value={filters.due ?? ""}
                onChange={(v) => set({ due: (v || undefined) as DueFilter | undefined })}
              >
                <option value="">Any time</option>
                {DUE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
              <Select label="Sort by" value={sort} onChange={(v) => setSort(v as TaskSort)}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>

            {visible.length > 0 ? (
              <TaskList label="Tasks">
                {visible.map((task) => (
                  <TaskItem key={task.id} task={task} today={today} projects={projects} />
                ))}
              </TaskList>
            ) : tasks.length === 0 ? (
              <EmptyState title="No tasks yet." description="Capture your first task from Today." />
            ) : (
              <EmptyState
                title="No tasks match these filters."
                action={
                  filtered && <Button onClick={() => setFilters(DEFAULT_FILTERS)}>Clear filters</Button>
                }
              />
            )}
          </>
        );
      }}
    </DataGate>
  );
}
