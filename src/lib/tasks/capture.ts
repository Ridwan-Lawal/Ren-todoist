import { findProjectByName } from "@/lib/projects/project-service";
import type { Project } from "@/lib/projects/project-types";
import { parseTaskInput } from "@/lib/parser/task-parser";
import { createTask } from "./task-service";
import type { Task } from "./task-types";

export type CaptureOptions = {
  today: string;
  projects: Project[];
  ignoreParsing?: boolean;
  defaultProjectId?: string;
};

/** Quick Capture: raw input → (optional) parse → validated task → persisted. */
export function captureTask(raw: string, { today, projects, ignoreParsing, defaultProjectId }: CaptureOptions): Task {
  if (ignoreParsing) return createTask({ title: raw, projectId: defaultProjectId });

  const { projectName, ...parsed } = parseTaskInput(raw, { today, projects });
  const project = projectName ? findProjectByName(projects, projectName) : undefined;
  return createTask({ ...parsed, projectId: project?.id ?? defaultProjectId });
}
