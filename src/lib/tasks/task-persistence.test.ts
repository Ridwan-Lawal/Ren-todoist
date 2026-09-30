import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StorageError, subscribe } from "@/lib/storage/local-storage";
import { createTask, getTasks, resetTasks } from "./task-service";

const KEY = "todo-app:tasks";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("task persistence", () => {
  it("starts empty when nothing is stored", () => {
    expect(getTasks()).toEqual([]);
  });

  it("reads tasks written by another session", () => {
    const task = createTask({ title: "Saved earlier" });
    localStorage.setItem(KEY, JSON.stringify([{ ...task, title: "Edited elsewhere" }]));

    expect(getTasks()[0].title).toBe("Edited elsewhere");
  });

  it.each([
    ["malformed JSON", "{not json"],
    ["an unexpected shape", JSON.stringify([{ title: 42 }])],
  ])("reports %s as unreadable without overwriting it", (_, raw) => {
    localStorage.setItem(KEY, raw);

    expect(() => getTasks()).toThrow(expect.objectContaining({ kind: "unreadable" }));
    expect(() => createTask({ title: "New" })).toThrow(StorageError);
    expect(localStorage.getItem(KEY)).toBe(raw);
  });

  it("starts fresh by backing up unreadable data first", () => {
    localStorage.setItem(KEY, "{not json");

    resetTasks();

    expect(localStorage.getItem(`${KEY}:backup`)).toBe("{not json");
    expect(getTasks()).toEqual([]);
    expect(createTask({ title: "Fresh start" }).title).toBe("Fresh start");
  });

  it("reports a failed write when storage is full", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });

    expect(() => createTask({ title: "Too much" })).toThrow(expect.objectContaining({ kind: "write-failed" }));
  });
});

describe("change notifications", () => {
  it("notifies subscribers of local writes and of changes from other tabs", () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    createTask({ title: "Local" });
    expect(listener).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
    expect(listener).toHaveBeenCalledTimes(2);

    window.dispatchEvent(new StorageEvent("storage", { key: "unrelated" }));
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    createTask({ title: "After unsubscribe" });
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
