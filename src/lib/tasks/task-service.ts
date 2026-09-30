import { backupAndReset, readCollection, STORAGE_KEYS, writeCollection } from "@/lib/storage/local-storage";
import { normalizeTags } from "./tags";
import { NewTaskInput, Subtask, Task, taskSchema, TaskUpdates, TITLE_MAX_LENGTH } from "./task-types";

export class TaskValidationError extends Error {
  constructor(readonly reason: "empty-title" | "title-too-long" | "not-found") {
    super(`Invalid task: ${reason}`);
    this.name = "TaskValidationError";
  }
}

function validateTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) throw new TaskValidationError("empty-title");
  if (trimmed.length > TITLE_MAX_LENGTH) throw new TaskValidationError("title-too-long");
  return trimmed;
}

export function getTasks(): Task[] {
  return readCollection(STORAGE_KEYS.tasks, taskSchema);
}

/** "Start fresh": backs up unreadable task data, then resets to an empty list. */
export function resetTasks(): void {
  backupAndReset(STORAGE_KEYS.tasks);
}

function saveTasks(tasks: Task[]) {
  writeCollection(STORAGE_KEYS.tasks, tasks);
}

export function createTask(input: NewTaskInput): Task {
  const title = validateTitle(input.title);
  const tasks = getTasks();
  const now = new Date().toISOString();
  const task: Task = {
    id: crypto.randomUUID(),
    title,
    notes: input.notes || undefined,
    status: "active",
    priority: input.priority ?? "none",
    dueDate: input.dueDate,
    dueTime: input.dueTime,
    projectId: input.projectId,
    tags: normalizeTags(input.tags ?? []),
    subtasks: [],
    createdAt: now,
    updatedAt: now,
  };
  saveTasks([...tasks, task]);
  return task;
}

export function getTask(id: string): Task | undefined {
  return getTasks().find((task) => task.id === id);
}

/** Reads, applies `change` to one task, persists, and returns the updated task. */
function modifyTask(id: string, change: (task: Task) => Task): Task {
  const tasks = getTasks();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) throw new TaskValidationError("not-found");
  const updated = { ...change(tasks[index]), updatedAt: new Date().toISOString() };
  saveTasks(tasks.map((task, i) => (i === index ? updated : task)));
  return updated;
}

export function updateTask(id: string, updates: TaskUpdates): Task {
  const normalized: TaskUpdates = { ...updates };
  if ("title" in updates) normalized.title = validateTitle(updates.title ?? "");
  if ("tags" in updates) normalized.tags = normalizeTags(updates.tags ?? []);
  if ("notes" in updates) normalized.notes = updates.notes || undefined;
  if ("dueDate" in updates && !updates.dueDate) normalized.dueTime = undefined;
  return modifyTask(id, (task) => ({ ...task, ...normalized }));
}

export function completeTask(id: string): Task {
  return modifyTask(id, (task) => ({ ...task, status: "completed", completedAt: new Date().toISOString() }));
}

export function uncompleteTask(id: string): Task {
  return modifyTask(id, (task) => ({ ...task, status: "active", completedAt: undefined }));
}

/** Moves a task to a new date, keeping its time; removing the date also removes the time. */
export function rescheduleTask(id: string, dueDate: string | undefined): Task {
  return updateTask(id, { dueDate });
}

export function archiveTask(id: string): Task {
  return modifyTask(id, (task) => ({ ...task, status: "archived", completedAt: undefined }));
}

export function unarchiveTask(id: string): Task {
  return modifyTask(id, (task) => ({ ...task, status: "active" }));
}

export function deleteTask(id: string): void {
  saveTasks(getTasks().filter((task) => task.id !== id));
}

/** Removes a project from every task that references it. */
export function clearProjectFromTasks(projectId: string): void {
  const tasks = getTasks();
  if (!tasks.some((task) => task.projectId === projectId)) return;
  saveTasks(tasks.map((task) => (task.projectId === projectId ? { ...task, projectId: undefined } : task)));
}

export function addSubtask(taskId: string, title: string): Task {
  const subtaskTitle = validateTitle(title);
  return modifyTask(taskId, (task) => ({
    ...task,
    subtasks: [...task.subtasks, { id: crypto.randomUUID(), title: subtaskTitle, completed: false }],
  }));
}

export function updateSubtask(
  taskId: string,
  subtaskId: string,
  updates: Partial<Pick<Subtask, "title" | "completed">>,
): Task {
  const normalized = { ...updates };
  if ("title" in updates) normalized.title = validateTitle(updates.title ?? "");
  return modifyTask(taskId, (task) => ({
    ...task,
    subtasks: task.subtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, ...normalized } : subtask)),
  }));
}

export function removeSubtask(taskId: string, subtaskId: string): Task {
  return modifyTask(taskId, (task) => ({
    ...task,
    subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
  }));
}
