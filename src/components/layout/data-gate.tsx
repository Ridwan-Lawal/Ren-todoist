"use client";

import { useReducer } from "react";
import { useProjects } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import { useToday } from "@/hooks/use-today";
import type { Project } from "@/lib/projects/project-types";
import { resetProjects } from "@/lib/projects/project-service";
import type { Task } from "@/lib/tasks/task-types";
import { resetTasks } from "@/lib/tasks/task-service";
import { ListSkeleton, LoadError } from "@/components/ui/states";
import { useSafeAction } from "@/components/ui/notice";

export type AppData = { tasks: Task[]; projects: Project[]; today: string };

/** Renders children only once tasks, projects and today's date are available; otherwise loading or error UI. */
export function DataGate({ children }: { children: (data: AppData) => React.ReactNode }) {
  const tasks = useTasks();
  const projects = useProjects();
  const today = useToday();
  const [, retry] = useReducer((n: number) => n + 1, 0);
  const safely = useSafeAction();

  if (tasks.status === "error") {
    return (
      <LoadError
        what="tasks"
        kind={tasks.kind}
        onRetry={retry}
        onStartFresh={() => safely(resetTasks, "We couldn't reset your tasks. Try again.")}
      />
    );
  }
  if (projects.status === "error") {
    return (
      <LoadError
        what="projects"
        kind={projects.kind}
        onRetry={retry}
        onStartFresh={() => safely(resetProjects, "We couldn't reset your projects. Try again.")}
      />
    );
  }
  if (tasks.status === "loading" || projects.status === "loading" || !today) {
    return <ListSkeleton />;
  }
  return <>{children({ tasks: tasks.items, projects: projects.items, today })}</>;
}
