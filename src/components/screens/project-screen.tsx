"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { focusQuickCapture, QuickCapture } from "@/components/capture/quick-capture";
import { DataGate } from "@/components/layout/data-gate";
import { ProjectNameForm } from "@/components/project/project-name-form";
import { TaskItem, TaskList } from "@/components/task/task-item";
import { Button, buttonClasses } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useSafeAction } from "@/components/ui/notice";
import { EmptyState } from "@/components/ui/states";
import { deleteProject, renameProject } from "@/lib/projects/project-service";
import { compareByAttention } from "@/lib/tasks/task-views";

export function ProjectScreen({ id }: { id: string }) {
  const router = useRouter();
  const safely = useSafeAction();
  const [renaming, setRenaming] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <DataGate>
      {({ tasks, projects, today }) => {
        const project = projects.find((p) => p.id === id);
        if (!project) {
          return (
            <EmptyState
              title="This project is no longer available."
              action={
                <Link href="/projects" className={buttonClasses("secondary")}>
                  Back to Projects
                </Link>
              }
            />
          );
        }

        const projectTasks = tasks.filter((task) => task.projectId === id);
        const active = projectTasks.filter((task) => task.status === "active").sort(compareByAttention);
        const completed = projectTasks
          .filter((task) => task.status === "completed")
          .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));

        return (
          <>
            <Link
              href="/projects"
              className="-ml-2 mb-6 inline-flex min-h-11 items-center rounded-md px-2 text-sm text-muted hover:text-foreground"
            >
              ← Projects
            </Link>

            <header className="mb-8">
              {renaming ? (
                <ProjectNameForm
                  id="rename-project"
                  initialName={project.name}
                  submitLabel="Save"
                  onSubmit={(name) => {
                    const renamed = renameProject(project.id, name);
                    setRenaming(false);
                    return renamed;
                  }}
                  onCancel={() => setRenaming(false)}
                />
              ) : (
                <>
                  <h1 className="break-words text-[28px] font-semibold leading-tight tracking-tight md:text-[32px]">
                    {project.name}
                  </h1>
                  <p className="mt-1 text-sm text-muted">
                    {active.length} {active.length === 1 ? "task" : "tasks"}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" onClick={() => setRenaming(true)}>
                      Rename
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setConfirmDelete(true)}>
                      Delete project
                    </Button>
                  </div>
                </>
              )}
            </header>

            <QuickCapture
              today={today}
              projects={projects}
              defaultProjectId={project.id}
              placeholder={`Add a task to ${project.name}`}
            />

            {active.length + completed.length === 0 ? (
              <EmptyState
                title="No tasks in this project."
                action={<Button onClick={focusQuickCapture}>Add task</Button>}
              />
            ) : (
              <TaskList label={`${project.name} tasks`}>
                {[...active, ...completed].map((task) => (
                  <TaskItem key={task.id} task={task} today={today} projects={projects} hideProject />
                ))}
              </TaskList>
            )}

            <ConfirmDialog
              open={confirmDelete}
              title="Delete this project?"
              description={`“${project.name}” will be deleted. Its tasks are kept and moved out of the project.`}
              confirmLabel="Delete project"
              onCancel={() => setConfirmDelete(false)}
              onConfirm={() => {
                setConfirmDelete(false);
                if (safely(() => (deleteProject(project.id), true))) router.push("/projects");
              }}
            />
          </>
        );
      }}
    </DataGate>
  );
}
