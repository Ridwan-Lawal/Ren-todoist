import { beforeEach, describe, expect, it } from "vitest";
import { createTask, getTask } from "@/lib/tasks/task-service";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  ProjectValidationError,
  renameProject,
} from "./project-service";

beforeEach(() => {
  localStorage.clear();
});

describe("projects", () => {
  it("creates a project from a trimmed name", () => {
    const project = createProject("  Portfolio ");

    expect(project.name).toBe("Portfolio");
    expect(getProjects()).toEqual([project]);
    expect(getProject(project.id)).toEqual(project);
  });

  it("rejects empty names and names that differ only by case", () => {
    createProject("Work");

    expect(() => createProject(" ")).toThrow(expect.objectContaining({ reason: "empty-name" }));
    expect(() => createProject("work ")).toThrow(expect.objectContaining({ reason: "duplicate-name" }));
    expect(getProjects()).toHaveLength(1);
  });

  it("renames a project, allowing a case change of its own name", () => {
    const work = createProject("Work");
    createProject("Personal");

    expect(renameProject(work.id, "WORK").name).toBe("WORK");
    expect(() => renameProject(work.id, "personal")).toThrow(ProjectValidationError);
  });

  it("deletes a project but keeps its tasks, now unassigned", () => {
    const project = createProject("Learning");
    const task = createTask({ title: "Study React", projectId: project.id });

    deleteProject(project.id);

    expect(getProjects()).toEqual([]);
    expect(getTask(task.id)).toMatchObject({ title: "Study React", projectId: undefined });
  });
});
