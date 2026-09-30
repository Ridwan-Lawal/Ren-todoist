import { beforeEach, describe, expect, it } from "vitest";
import {
  addSubtask,
  archiveTask,
  completeTask,
  createTask,
  deleteTask,
  getTask,
  getTasks,
  removeSubtask,
  rescheduleTask,
  TaskValidationError,
  unarchiveTask,
  uncompleteTask,
  updateSubtask,
  updateTask,
} from "./task-service";

beforeEach(() => {
  localStorage.clear();
});

describe("creating a task", () => {
  it("persists a task with defaults for missing fields", () => {
    const task = createTask({ title: "  Buy milk  " });

    expect(task).toMatchObject({
      title: "Buy milk",
      status: "active",
      priority: "none",
      tags: [],
      subtasks: [],
    });
    expect(getTasks()).toEqual([task]);
  });
});

describe("task title rules", () => {
  it("rejects an empty title", () => {
    expect(() => createTask({ title: "   " })).toThrow(TaskValidationError);
    expect(getTasks()).toEqual([]);
  });

  it("accepts exactly 500 characters and rejects 501", () => {
    expect(createTask({ title: "a".repeat(500) }).title).toHaveLength(500);
    expect(() => createTask({ title: "a".repeat(501) })).toThrow(TaskValidationError);
  });

  it("keeps optional fields and normalizes tags", () => {
    const task = createTask({
      title: "Plan launch",
      notes: "Draft the outline",
      priority: "high",
      dueDate: "2026-10-02",
      dueTime: "15:00",
      tags: ["#Work", "work", " Launch-Plan ", "bad tag!"],
    });

    expect(task).toMatchObject({
      notes: "Draft the outline",
      priority: "high",
      dueDate: "2026-10-02",
      dueTime: "15:00",
      tags: ["work", "launch-plan", "badtag"],
    });
  });
});

describe("acting on a task", () => {
  it("completes and un-completes a task", () => {
    const { id } = createTask({ title: "Send proposal" });

    const completed = completeTask(id);
    expect(completed.status).toBe("completed");
    expect(completed.completedAt).toEqual(expect.any(String));

    const reopened = uncompleteTask(id);
    expect(reopened.status).toBe("active");
    expect(reopened.completedAt).toBeUndefined();
    expect(getTask(id)).toEqual(reopened);
  });

  it("reschedules and removes a due date", () => {
    const { id } = createTask({ title: "Call client", dueTime: "09:30" });

    expect(rescheduleTask(id, "2026-10-05")).toMatchObject({ dueDate: "2026-10-05", dueTime: "09:30" });

    const cleared = rescheduleTask(id, undefined);
    expect(cleared.dueDate).toBeUndefined();
    expect(cleared.dueTime).toBeUndefined();
  });

  it("archives and unarchives without losing the task", () => {
    const { id } = createTask({ title: "Old idea" });

    expect(archiveTask(id).status).toBe("archived");
    expect(unarchiveTask(id).status).toBe("active");
    expect(getTasks()).toHaveLength(1);
  });

  it("restores a completed task as completed when unarchived", () => {
    const { id } = createTask({ title: "Shipped" });
    const { completedAt } = completeTask(id);

    archiveTask(id);
    const restored = unarchiveTask(id);

    expect(restored).toMatchObject({ status: "completed", completedAt });
  });

  it("deletes a task permanently", () => {
    const keep = createTask({ title: "Keep" });
    const remove = createTask({ title: "Remove" });

    deleteTask(remove.id);

    expect(getTasks()).toEqual([keep]);
    expect(getTask(remove.id)).toBeUndefined();
  });

  it("updates fields, normalizing tags and rejecting an empty title", () => {
    const { id } = createTask({ title: "Draft" });

    const updated = updateTask(id, { title: "Final draft", notes: "Long notes", priority: "low", tags: ["A", "a"] });
    expect(updated).toMatchObject({ title: "Final draft", notes: "Long notes", priority: "low", tags: ["a"] });

    expect(() => updateTask(id, { title: "  " })).toThrow(TaskValidationError);
    expect(getTask(id)?.title).toBe("Final draft");
  });

  it("throws when the task does not exist", () => {
    expect(() => completeTask("missing")).toThrow(TaskValidationError);
  });
});

describe("subtasks", () => {
  it("adds, completes, renames and removes subtasks without completing the parent", () => {
    const { id } = createTask({ title: "Portfolio" });

    const withSubtasks = addSubtask(addSubtask(id, "Homepage").id, "Contact page");
    const [first, second] = withSubtasks.subtasks;
    expect(withSubtasks.subtasks.map((s) => s.title)).toEqual(["Homepage", "Contact page"]);

    updateSubtask(id, first.id, { completed: true });
    const allDone = updateSubtask(id, second.id, { completed: true, title: "Contact" });
    expect(allDone.subtasks.every((s) => s.completed)).toBe(true);
    expect(allDone.subtasks[1].title).toBe("Contact");
    expect(allDone.status).toBe("active");

    expect(removeSubtask(id, first.id).subtasks.map((s) => s.title)).toEqual(["Contact"]);
  });
});
