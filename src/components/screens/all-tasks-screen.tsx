"use client";

import { useState } from "react";
import { DataGate } from "@/components/layout/data-gate";
import { PRIORITY_LABELS } from "@/components/task/task-labels";
import { TaskItem, TaskList } from "@/components/task/task-item";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
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

/** A compact labelled select; the label reads as a prefix inside the control. */
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
  const active = value !== "";
  return (
    <label
      className={`relative inline-flex min-h-11 items-center gap-1.5 rounded-md border pl-3 text-sm transition-colors duration-150 md:min-h-9 ${
        active ? "border-accent/40 bg-accent/5 text-foreground" : "border-border bg-surface text-muted hover:border-muted/40"
      }`}
    >
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 cursor-pointer appearance-none bg-transparent pr-7 font-medium text-foreground focus-visible:outline-none md:min-h-9"
      >
        {children}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-2.5 text-meta text-muted">
        ▾
      </span>
    </label>
  );
}

export function AllTasksScreen() {
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<TaskSort>("dueDate");
  const set = (patch: Partial<TaskFilters>) => setFilters((current) => ({ ...current, ...patch }));
  const hasFilters = !!(filters.priority || filters.projectId || filters.tag || filters.due);

  return (
    <DataGate>
      {({ tasks, projects, today }) => {
        const visible = sortTasks(filterTasks(tasks, filters, today), sort);
        const tags = collectTags(tasks);
        return (
          <>
            <PageHeader title="All Tasks" meta={`${visible.length} ${visible.length === 1 ? "task" : "tasks"}`} />

            <div role="group" aria-label="Filter and sort" className="mb-8 flex flex-col gap-3">
              <SegmentedControl
                label="Status"
                value={filters.status}
                onChange={(status) => set({ status })}
                options={STATUS_OPTIONS}
              />
              <div className="flex flex-wrap items-center gap-2">
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
                {hasFilters && (
                  <Button size="sm" variant="ghost" onClick={() => setFilters({ status: filters.status })}>
                    Clear filters
                  </Button>
                )}
                <div className="ml-auto">
                  <label className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted md:min-h-9">
                    Sort
                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value as TaskSort)}
                      className="cursor-pointer rounded-sm bg-transparent font-medium text-foreground"
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
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
                title={hasFilters ? "No tasks match these filters." : `No ${filters.status} tasks.`}
                description={
                  hasFilters ? undefined : `Nothing is ${filters.status === "active" ? "open" : filters.status} right now.`
                }
                action={hasFilters && <Button onClick={() => setFilters({ status: filters.status })}>Clear filters</Button>}
              />
            )}
          </>
        );
      }}
    </DataGate>
  );
}
