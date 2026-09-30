# Ren

A calm, personal task manager. Capture a thought in seconds, see what needs your attention today, and get things done.

Ren runs entirely in the browser: tasks and projects are saved to Local Storage. There are no accounts, and no data leaves the device.

## Features

- **Quick Capture**: type a task and press Enter. Simple hints are understood:
  - a date or time at the end: `today`, `tomorrow`, `friday`, `next week`, `this weekend`, `at 3pm`, `15:00`
  - anywhere: `!high` / `!med` / `!low`, `#tag`, `@project` (existing projects only)
  - a preview line shows what was recognised; `×` keeps your exact text
- **Today**: overdue, due-today and undated tasks, the next 7 days in Upcoming, and a collapsed list of what you finished today.
- **Task Details**: notes, due date and time, priority, project, tags and subtasks, saved automatically. Archive, unarchive and delete (with confirmation).
- **Projects**: group related tasks, capture straight into a project, rename or delete (tasks are kept).
- **All Tasks**: filter by status, priority, project, tag and due date; sort by due date, priority, newest or alphabetically.
- **Reliable storage**: data survives refreshes, stays in sync across tabs, and unreadable data is backed up before any reset.

## Getting started

Requires Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev         # http://localhost:3000
```

## Scripts

| Command          | What it does                  |
| ---------------- | ----------------------------- |
| `pnpm dev`       | Start the development server  |
| `pnpm build`     | Production build              |
| `pnpm start`     | Serve the production build    |
| `pnpm test`      | Run the Vitest suite          |
| `pnpm typecheck` | Type-check with TypeScript    |
| `pnpm lint`      | Lint with ESLint              |

## Architecture

```text
UI (components, screens)
 ↓
Hooks (useTasks, useProjects, useToday)
 ↓
Application core (task & project services, capture, parser, derived views)
 ↓
Storage layer (validated with Zod)
 ↓
Local Storage
```

Only the storage layer touches `localStorage`. Tests cover the application core against a real (jsdom) `localStorage`.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zod and Vitest.

## Documentation

Product, design, screen, architecture and implementation docs live in [`docs/`](docs/). Start with [`docs/spec.md`](docs/spec.md).
