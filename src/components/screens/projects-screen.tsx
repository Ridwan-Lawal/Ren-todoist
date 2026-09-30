"use client";

import Link from "next/link";
import { DataGate } from "@/components/layout/data-gate";
import { ProjectNameForm } from "@/components/project/project-name-form";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/states";
import { createProject } from "@/lib/projects/project-service";
import { countActiveTasksByProject } from "@/lib/tasks/task-views";

const NEW_PROJECT_INPUT = "new-project-name";

export function ProjectsScreen() {
  return (
    <DataGate>
      {({ tasks, projects }) => {
        const counts = countActiveTasksByProject(tasks);
        const sorted = [...projects].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
        return (
          <>
            <PageHeader title="Projects" />
            <ProjectNameForm id={NEW_PROJECT_INPUT} submitLabel="Add project" onSubmit={createProject} />

            {sorted.length === 0 ? (
              <EmptyState
                title="No projects yet."
                description="Projects help you organize related tasks."
                action={
                  <Button onClick={() => document.getElementById(NEW_PROJECT_INPUT)?.focus()}>Create project</Button>
                }
              />
            ) : (
              <ul className="mt-6 flex flex-col">
                {sorted.map((project) => {
                  const count = counts[project.id] ?? 0;
                  return (
                    <li key={project.id} className="animate-enter border-b border-border/70 last:border-b-0">
                      <Link
                        href={`/projects/${project.id}`}
                        className="-mx-3 flex min-h-14 flex-col justify-center rounded-md px-3 py-2 hover:bg-subtle"
                      >
                        <span className="break-words text-[15px] font-medium">{project.name}</span>
                        <span className="text-[13px] text-muted">
                          {count} {count === 1 ? "task" : "tasks"}
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
