import { describe, expect, it } from "vitest";
import type { Project } from "@/lib/projects/project-types";
import { parseTaskInput } from "./task-parser";

const TODAY = "2026-09-30"; // Wednesday
const project = (name: string): Project => ({ id: name.toLowerCase(), name, createdAt: "", updatedAt: "" });
const projects = [project("Portfolio"), project("Side Project")];
const parse = (input: string) => parseTaskInput(input, { today: TODAY, projects });

describe("parsing Quick Capture input", () => {
  it("returns plain text unchanged", () => {
    expect(parse("  Buy   milk ")).toEqual({ title: "Buy milk" });
  });

  it.each([
    ["Buy milk today", "2026-09-30"],
    ["Buy milk tomorrow", "2026-10-01"],
    ["Buy milk friday", "2026-10-02"],
    ["Buy milk Fri", "2026-10-02"],
    ["Buy milk on monday", "2026-10-05"],
    ["Buy milk wednesday", "2026-09-30"],
    ["Buy milk next week", "2026-10-05"],
    ["Buy milk this weekend", "2026-10-03"],
  ])("reads a trailing date: %s", (input, dueDate) => {
    expect(parse(input)).toEqual({ title: "Buy milk", dueDate });
  });

  it.each([
    ["Call John tomorrow at 3pm", "2026-10-01", "15:00"],
    ["Call John at 3:30pm tomorrow", "2026-10-01", "15:30"],
    ["Call John friday 15:00", "2026-10-02", "15:00"],
    ["Call John at 12am", "2026-09-30", "00:00"],
  ])("reads a trailing time: %s", (input, dueDate, dueTime) => {
    expect(parse(input)).toEqual({ title: "Call John", dueDate, dueTime });
  });

  it("treats a time without a date as today", () => {
    expect(parse("Stand-up at 9am")).toEqual({ title: "Stand-up", dueDate: TODAY, dueTime: "09:00" });
  });

  it("leaves date words in the middle of a title alone", () => {
    expect(parse("Call Monday Group about launch")).toEqual({ title: "Call Monday Group about launch" });
  });

  it("reads priority, tags and an existing project anywhere", () => {
    expect(parse("!high Ship #Work the site @portfolio #launch tomorrow")).toEqual({
      title: "Ship the site",
      priority: "high",
      tags: ["work", "launch"],
      projectName: "Portfolio",
      dueDate: "2026-10-01",
    });
    expect(parse("Tidy desk !2").priority).toBe("medium");
    expect(parse("Tidy desk !low").priority).toBe("low");
    expect(parse("Plan @side-project").projectName).toBe("Side Project");
  });

  it("keeps an unmatched @name in the title", () => {
    expect(parse("Update @Portfolo readme")).toEqual({ title: "Update @Portfolo readme" });
  });

  it("does not parse when nothing would be left for the title", () => {
    expect(parse("tomorrow")).toEqual({ title: "tomorrow" });
    expect(parse("#work")).toEqual({ title: "#work" });
  });
});
