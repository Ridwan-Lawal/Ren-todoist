import { beforeEach, describe, expect, it } from "vitest";
import { createProject, getProjects } from "@/lib/projects/project-service";
import { captureTask } from "./capture";
import { getTasks, TaskValidationError } from "./task-service";

const TODAY = "2026-09-30";

beforeEach(() => {
  localStorage.clear();
});

describe("Quick Capture", () => {
  it("creates a task from parsed input, resolving the project", () => {
    const portfolio = createProject("Portfolio");

    const task = captureTask("Finish case study @portfolio #design !high friday at 3pm", {
      today: TODAY,
      projects: getProjects(),
    });

    expect(task).toMatchObject({
      title: "Finish case study",
      projectId: portfolio.id,
      tags: ["design"],
      priority: "high",
      dueDate: "2026-10-02",
      dueTime: "15:00",
    });
    expect(getTasks()).toEqual([task]);
  });

  it("uses the raw text as the title when parsing is ignored", () => {
    const task = captureTask("Read Tomorrow magazine tomorrow", { today: TODAY, projects: [], ignoreParsing: true });

    expect(task).toMatchObject({ title: "Read Tomorrow magazine tomorrow", dueDate: undefined });
  });

  it("assigns the default project unless the input names another", () => {
    const work = createProject("Work");
    const home = createProject("Home");
    const projects = getProjects();

    expect(captureTask("Email team", { today: TODAY, projects, defaultProjectId: work.id }).projectId).toBe(work.id);
    expect(captureTask("Fix sink @home", { today: TODAY, projects, defaultProjectId: work.id }).projectId).toBe(home.id);
  });

  it("does not create a task from empty input", () => {
    expect(() => captureTask("   ", { today: TODAY, projects: [] })).toThrow(TaskValidationError);
    expect(getTasks()).toEqual([]);
  });
});
