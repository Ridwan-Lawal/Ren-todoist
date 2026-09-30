import { backupAndReset, readCollection, STORAGE_KEYS, writeCollection } from "@/lib/storage/local-storage";
import { clearProjectFromTasks } from "@/lib/tasks/task-service";
import { Project, projectSchema } from "./project-types";

export class ProjectValidationError extends Error {
  constructor(readonly reason: "empty-name" | "duplicate-name" | "not-found") {
    super(`Invalid project: ${reason}`);
    this.name = "ProjectValidationError";
  }
}

export function getProjects(): Project[] {
  return readCollection(STORAGE_KEYS.projects, projectSchema);
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((project) => project.id === id);
}

/** Finds a project by name, ignoring case and surrounding whitespace. */
export function findProjectByName(projects: Project[], name: string): Project | undefined {
  const key = name.trim().toLowerCase();
  return projects.find((project) => project.name.toLowerCase() === key);
}

/** "Start fresh": backs up unreadable project data, then resets to an empty list. */
export function resetProjects(): void {
  backupAndReset(STORAGE_KEYS.projects);
}

function validateName(projects: Project[], name: string, exceptId?: string): string {
  const trimmed = name.trim();
  if (!trimmed) throw new ProjectValidationError("empty-name");
  const existing = findProjectByName(projects, trimmed);
  if (existing && existing.id !== exceptId) throw new ProjectValidationError("duplicate-name");
  return trimmed;
}

export function createProject(name: string): Project {
  const projects = getProjects();
  const now = new Date().toISOString();
  const project: Project = {
    id: crypto.randomUUID(),
    name: validateName(projects, name),
    createdAt: now,
    updatedAt: now,
  };
  writeCollection(STORAGE_KEYS.projects, [...projects, project]);
  return project;
}

export function renameProject(id: string, name: string): Project {
  const projects = getProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) throw new ProjectValidationError("not-found");
  const renamed = { ...project, name: validateName(projects, name, id), updatedAt: new Date().toISOString() };
  writeCollection(
    STORAGE_KEYS.projects,
    projects.map((p) => (p.id === id ? renamed : p)),
  );
  return renamed;
}

/** Deletes a project. Its tasks are kept and become unassigned. */
export function deleteProject(id: string): void {
  clearProjectFromTasks(id);
  writeCollection(
    STORAGE_KEYS.projects,
    getProjects().filter((project) => project.id !== id),
  );
}
