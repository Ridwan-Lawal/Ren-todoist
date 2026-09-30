"use client";

import Link from "next/link";
import { useState } from "react";
import { DataGate } from "@/components/layout/data-gate";
import { ProjectNameForm } from "@/components/project/project-name-form";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/states";
import { createProject } from "@/lib/projects/project-service";
import { countActiveTasksByProject } from "@/lib/tasks/task-views";

export function ProjectsScreen() {
  const [creating, setCreating] = useState(false);

  return (
    <DataGate>
      {({ tasks, projects }) => {
        const counts = countActiveTasksByProject(tasks);
        const sorted = [...projects].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
        const plural = (n: number) => `${n} ${n === 1 ? "task" : "tasks"}`;

        return (
          <>
            <PageHeader
              title="Projects"
              meta={sorted.length > 0 ? `${sorted.length} ${sorted.length === 1 ? "project" : "projects"}` : undefined}
              actions={
                !creating &&
                sorted.length > 0 && (
                  <Button size="sm" onClick={() => setCreating(true)}>
                    New project
                  </Button>
                )
              }
            />

            {creating && (
              <div className="animate-enter mb-8">
                <ProjectNameForm
                  id="new-project-name"
                  submitLabel="Create"
                  onSubmit={(name) => {
                    const project = createProject(name);
                    setCreating(false);
                    return project;
                  }}
                  onCancel={() => setCreating(false)}
                />
              </div>
            )}

            {sorted.length === 0 ? (
              !creating && (
                <EmptyState
                  title="No projects yet."
                  description="Projects help you organize related tasks."
                  action={
                    <Button variant="primary" onClick={() => setCreating(true)}>
                      Create project
                    </Button>
                  }
                />
              )
            ) : (
              <ul className="flex flex-col gap-px">
                {sorted.map((project) => {
                  const count = counts[project.id] ?? 0;
                  return (
                    <li key={project.id} className="animate-enter">
                      <Link
                        href={`/projects/${project.id}`}
                        className="group -mx-2 flex min-h-14 items-center gap-4 rounded-md px-2 py-2 transition-colors duration-150 hover:bg-subtle/70"
                      >
                        <span className="min-w-0 flex-1 break-words text-title font-medium">{project.name}</span>
                        <span className="text-meta tabular-nums text-muted">{count === 0 ? "No open tasks" : plural(count)}</span>
                        <span
                          aria-hidden
                          className="text-muted/60 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground"
                        >
                          ›
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        );
      }}
    </DataGate>
  );
}
