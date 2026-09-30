import { findProjectByName } from "@/lib/projects/project-service";
import type { Project } from "@/lib/projects/project-types";
import { normalizeTag } from "@/lib/tasks/tags";
import type { ParsedTaskInput, TaskPriority } from "@/lib/tasks/task-types";
import { addDays, nextWeek, nextWeekday, thisWeekend } from "@/lib/utils/dates";

type ParseContext = { today: string; projects: Project[] };

const PRIORITIES: Record<string, TaskPriority> = {
  high: "high",
  "1": "high",
  med: "medium",
  medium: "medium",
  "2": "medium",
  low: "low",
  "3": "low",
};

const WEEKDAYS: [RegExp, number][] = [
  [/^sun(day)?$/, 0],
  [/^mon(day)?$/, 1],
  [/^tue(s|sday)?$/, 2],
  [/^wed(nesday)?$/, 3],
  [/^thu(r|rs|rsday)?$/, 4],
  [/^fri(day)?$/, 5],
  [/^sat(urday)?$/, 6],
];

const TRAILING_DATE =
  /\s+(?:on\s+)?(today|tomorrow|next week|this weekend|sun(?:day)?|mon(?:day)?|tue(?:s|sday)?|wed(?:nesday)?|thu(?:r|rs|rsday)?|fri(?:day)?|sat(?:urday)?)$/i;
const TRAILING_TIME_12H = /\s+(?:at\s+)?(\d{1,2})(?::([0-5]\d))?\s*(am|pm)$/i;
const TRAILING_TIME_24H = /\s+(?:at\s+)?([01]?\d|2[0-3]):([0-5]\d)$/i;

const pad = (n: number) => String(n).padStart(2, "0");

function resolveDate(word: string, today: string): string {
  const phrase = word.toLowerCase();
  if (phrase === "today") return today;
  if (phrase === "tomorrow") return addDays(today, 1);
  if (phrase === "next week") return nextWeek(today);
  if (phrase === "this weekend") return thisWeekend(today);
  const match = WEEKDAYS.find(([pattern]) => pattern.test(phrase));
  return nextWeekday(today, match![1]);
}

function takeTrailingTime(text: string): { rest: string; time: string } | undefined {
  const twelve = text.match(TRAILING_TIME_12H);
  if (twelve) {
    const hours = Number(twelve[1]);
    if (hours < 1 || hours > 12) return undefined;
    const isPm = twelve[3].toLowerCase() === "pm";
    const hours24 = (hours % 12) + (isPm ? 12 : 0);
    return { rest: text.slice(0, twelve.index), time: `${pad(hours24)}:${twelve[2] ?? "00"}` };
  }
  const twentyFour = text.match(TRAILING_TIME_24H);
  if (twentyFour) {
    return { rest: text.slice(0, twentyFour.index), time: `${pad(Number(twentyFour[1]))}:${twentyFour[2]}` };
  }
  return undefined;
}

const collapse = (text: string) => text.replace(/\s+/g, " ").trim();

/**
 * Deterministic Quick Capture parser.
 * Markers (`!priority`, `#tag`, `@project`) are read anywhere; a date and/or time
 * only at the end, so words like "Monday" inside a title are left alone.
 */
export function parseTaskInput(input: string, { today, projects }: ParseContext): ParsedTaskInput {
  const original = collapse(input);
  const result: ParsedTaskInput = { title: original };
  const tags: string[] = [];

  let text = original.replace(/(^|\s)!(high|medium|med|low|[123])(?=\s|$)/gi, (_, lead, level) => {
    result.priority = PRIORITIES[level.toLowerCase()];
    return lead;
  });
  text = text.replace(/(^|\s)#([\w-]+)(?=\s|$)/g, (_, lead, tag) => {
    const normalized = normalizeTag(tag);
    if (normalized && !tags.includes(normalized)) tags.push(normalized);
    return lead;
  });
  text = text.replace(/(^|\s)@([\w-]+)(?=\s|$)/g, (whole, lead, name) => {
    const key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const match =
      findProjectByName(projects, name) ??
      projects.find((p) => p.name.toLowerCase().replace(/[^a-z0-9]/g, "") === key);
    if (!match || result.projectName) return whole;
    result.projectName = match.name;
    return lead;
  });
  if (tags.length) result.tags = tags;

  // Leading space lets the trailing patterns require a word boundary.
  text = " " + collapse(text);
  for (let i = 0; i < 2; i++) {
    if (!result.dueDate) {
      const date = text.match(TRAILING_DATE);
      if (date) {
        result.dueDate = resolveDate(date[1], today);
        text = text.slice(0, date.index);
        continue;
      }
    }
    if (!result.dueTime) {
      const time = takeTrailingTime(text);
      if (time) {
        result.dueTime = time.time;
        text = time.rest;
      }
    }
  }
  if (result.dueTime && !result.dueDate) result.dueDate = today;

  const title = collapse(text);
  if (!title) return { title: original };
  return { ...result, title };
}
