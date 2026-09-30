import { beforeEach, describe, expect, it, vi } from "vitest";
import { archiveTask, completeTask, createTask, getTasks } from "./task-service";
import {
  countActiveTasksByProject,
  filterTasks,
  getCompletedToday,
  getTodayView,
  getUpcoming,
  sortTasks,
} from "./task-views";

const TODAY = "2026-09-30"; // a Wednesday

beforeEach(() => {
  localStorage.clear();
  vi.useRealTimers();
});

const titles = (tasks: { title: string }[]) => tasks.map((t) => t.title);

describe("Today view", () => {
  it("groups active tasks into overdue, due today and undated", () => {
    createTask({ title: "Overdue", dueDate: "2026-09-28" });
    createTask({ title: "Due today", dueDate: TODAY });
    createTask({ title: "Undated" });
    createTask({ title: "Tomorrow", dueDate: "2026-10-01" });
    archiveTask(createTask({ title: "Archived" }).id);
    completeTask(createTask({ title: "Done" }).id);

    const view = getTodayView(getTasks(), TODAY);

    expect(titles(view.overdue)).toEqual(["Overdue"]);
    expect(titles(view.dueToday)).toEqual(["Due today"]);
    expect(titles(view.undated)).toEqual(["Undated"]);
  });

  it("orders each group by priority, then due time, then oldest first", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 30, 8));
    createTask({ title: "Low", dueDate: TODAY, priority: "low" });
    vi.setSystemTime(new Date(2026, 8, 30, 9));
    createTask({ title: "High late", dueDate: TODAY, priority: "high", dueTime: "17:00" });
    createTask({ title: "High early", dueDate: TODAY, priority: "high", dueTime: "09:00" });
    createTask({ title: "No priority", dueDate: TODAY });
    vi.setSystemTime(new Date(2026, 8, 30, 10));
    createTask({ title: "Low newer", dueDate: TODAY, priority: "low" });

    expect(titles(getTodayView(getTasks(), TODAY).dueToday)).toEqual([
      "High early",
      "High late",
      "Low",
      "Low newer",
      "No priority",
    ]);
  });

  it("moves tasks into the right groups when the day rolls over", () => {
    createTask({ title: "Was tomorrow", dueDate: "2026-10-01" });
    createTask({ title: "Was today", dueDate: TODAY });

    const nextDay = getTodayView(getTasks(), "2026-10-01");

    expect(titles(nextDay.dueToday)).toEqual(["Was tomorrow"]);
    expect(titles(nextDay.overdue)).toEqual(["Was today"]);
  });
});

describe("Upcoming", () => {
  it("groups active tasks due in the next 7 days by day", () => {
    createTask({ title: "Today", dueDate: TODAY });
    createTask({ title: "Thu B", dueDate: "2026-10-01", priority: "none" });
    createTask({ title: "Thu A", dueDate: "2026-10-01", priority: "high" });
    createTask({ title: "Next Wed", dueDate: "2026-10-07" });
    createTask({ title: "Too far", dueDate: "2026-10-08" });

    const upcoming = getUpcoming(getTasks(), TODAY);

    expect(upcoming.map((day) => [day.date, titles(day.tasks)])).toEqual([
      ["2026-10-01", ["Thu A", "Thu B"]],
      ["2026-10-07", ["Next Wed"]],
    ]);
  });
});

describe("Completed today", () => {
  it("includes only tasks completed on the current local date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 29, 23, 30));
    completeTask(createTask({ title: "Yesterday" }).id);
    vi.setSystemTime(new Date(2026, 8, 30, 0, 15));
    completeTask(createTask({ title: "Just after midnight" }).id);

    expect(titles(getCompletedToday(getTasks(), TODAY))).toEqual(["Just after midnight"]);
  });
});

describe("All Tasks filters and sorting", () => {
  it("filters by status, priority, project, tag and due date", () => {
    createTask({ title: "Work high", priority: "high", projectId: "p1", tags: ["work"], dueDate: TODAY });
    createTask({ title: "Home", tags: ["home"] });
    archiveTask(createTask({ title: "Archived" }).id);

    const tasks = getTasks();
    expect(titles(filterTasks(tasks, { status: "active" }, TODAY))).toEqual(["Work high", "Home"]);
    expect(titles(filterTasks(tasks, { status: "archived" }, TODAY))).toEqual(["Archived"]);
    expect(titles(filterTasks(tasks, { status: "active", priority: "high" }, TODAY))).toEqual(["Work high"]);
    expect(titles(filterTasks(tasks, { status: "active", projectId: "p1" }, TODAY))).toEqual(["Work high"]);
    expect(titles(filterTasks(tasks, { status: "active", tag: "home" }, TODAY))).toEqual(["Home"]);
    expect(titles(filterTasks(tasks, { status: "active", due: "today" }, TODAY))).toEqual(["Work high"]);
    expect(titles(filterTasks(tasks, { status: "active", due: "none" }, TODAY))).toEqual(["Home"]);
  });

  it("sorts by due date (undated last), priority, created date or title", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 30, 8));
    createTask({ title: "banana", dueDate: "2026-10-03", priority: "low" });
    vi.setSystemTime(new Date(2026, 8, 30, 9));
    createTask({ title: "Apple", priority: "high" });
    vi.setSystemTime(new Date(2026, 8, 30, 10));
    createTask({ title: "cherry", dueDate: "2026-10-01" });

    const tasks = getTasks();
    expect(titles(sortTasks(tasks, "dueDate"))).toEqual(["cherry", "banana", "Apple"]);
    expect(titles(sortTasks(tasks, "priority"))).toEqual(["Apple", "banana", "cherry"]);
    expect(titles(sortTasks(tasks, "created"))).toEqual(["cherry", "Apple", "banana"]);
    expect(titles(sortTasks(tasks, "title"))).toEqual(["Apple", "banana", "cherry"]);
  });

  it("counts only active tasks per project", () => {
    createTask({ title: "A", projectId: "p1" });
    completeTask(createTask({ title: "B", projectId: "p1" }).id);
    createTask({ title: "C" });

    expect(countActiveTasksByProject(getTasks())).toEqual({ p1: 1 });
  });
});
