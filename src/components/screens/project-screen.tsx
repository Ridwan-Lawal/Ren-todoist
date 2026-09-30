"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { focusQuickCapture, QuickCapture } from "@/components/capture/quick-capture";
import { DataGate } from "@/components/layout/data-gate";
import { ProjectNameForm } from "@/components/project/project-name-form";
import { TaskItem, TaskList } from "@/components/task/task-item";
import { BackLink } from "@/components/ui/back-link";
import { Button, buttonClasses } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useSafeAction } from "@/components/ui/notice";
import { EmptyState, GroupLabel, PageHeader } from "@/components/ui/states";
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
            <BackLink href="/projects" />

            {renaming ? (
              <div className="mb-8">
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
              </div>
            ) : (
              <PageHeader
                title={project.name}
                meta={active.length === 0 ? "No open tasks" : `${active.length} open ${active.length === 1 ? "task" : "tasks"}`}
                actions={
                  <>
                    <Button size="sm" variant="ghost" onClick={() => setRenaming(true)}>
                      Rename
                    </Button>
                    <Button size="sm" variant="ghost-destructive" onClick={() => setConfirmDelete(true)}>
                      Delete
                    </Button>
                  </>
                }
              />
            )}

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
              <div className="flex flex-col gap-6">
                {active.length > 0 && (
                  <TaskList label={`Open tasks in ${project.name}`}>
                    {active.map((task) => (
                      <TaskItem key={task.id} task={task} today={today} projects={projects} hideProject />
                    ))}
                  </TaskList>
                )}
                {completed.length > 0 && (
                  <div>
                    <GroupLabel id="project-completed">Completed</GroupLabel>
                    <TaskList labelledBy="project-completed">
                      {completed.map((task) => (
                        <TaskItem key={task.id} task={task} today={today} projects={projects} hideProject />
                      ))}
                    </TaskList>
                  </div>
                )}
              </div>
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
