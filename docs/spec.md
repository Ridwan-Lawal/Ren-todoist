# Ren V1 Spec

*Status: ready-for-agent (no issue tracker configured)*

## Problem Statement
People keep tasks, ideas and obligations in their heads or scattered across notes, messages and apps. That clutter competes with the work itself. They can't easily see what needs attention today, large goals feel hard to start, and existing tools either ask for too much structure before a thought can be saved or bury it in a busy dashboard. They need somewhere they can trust to put a thought within seconds and later see clearly what to act on.

## Solution
Ren is a calm, personal task app that runs entirely in the browser.

- **Quick Capture:** the user types a thought and presses Enter. The task is saved immediately. Simple natural-language hints are understood: a date or time at the end of the input, and `!priority`, `#tag` and `@project` anywhere. A preview line shows what was recognised before the user submits, and the user can choose to ignore it.
- **Today:** answers "what needs my attention?" It shows overdue, due-today and undated tasks, plus a short look at upcoming tasks and what was completed today.
- **Task Details:** the user adds notes, dates, priority, project, tags and subtasks. Changes save automatically.
- **Projects and All Tasks:** give the wider view, with simple filtering and sorting.
- **Storage:** everything is kept locally. Data survives refreshes, stays in sync across tabs, and is never silently destroyed if it becomes unreadable.

## User Stories

### Capture
1. As a busy person, I want to type a task and press Enter, so that the thought is out of my head within seconds.
2. As a user, I want the input to clear and stay focused after I submit, so that I can capture several thoughts in a row.
3. As a user, I want a new task to appear in my list immediately, so that I trust it was saved.
4. As a user, I want pressing Enter on an empty input to do nothing and give a gentle hint, so that I don't create blank tasks.
5. As a user, I want to end my input with "tomorrow", "friday", "today", "next week" or "this weekend", so that the due date is set without opening a picker.
6. As a user, I want to add "at 3pm", "3:30pm" or "15:00", so that the task gets a due time.
7. As a user, I want to type `!high`, `!med`, `!low` (or `!1`–`!3`) anywhere, so that I can set priority while capturing.
8. As a user, I want to type `#tag` anywhere, so that I can tag while capturing.
9. As a user, I want to type `@project` to file the task into an existing project, so that it's organised immediately.
10. As a user, I want an `@name` that matches no project to stay in the title, so that a typo never creates a stray project.
11. As a user, I want date words in the middle of a title ("Call Monday Group") left alone, so that the parser doesn't mangle my wording.
12. As a user, I want a live preview (e.g. "Fri · 3:00 PM · #work") while I type, so that I can see what Ren understood before I commit.
13. As a user, I want to dismiss the preview with ×, so that my exact text becomes the title when the parsing is wrong.
14. As a user, I want capture to work even if nothing is recognised, so that parsing never blocks me.
15. As a user, I want titles longer than 500 characters to be refused with a hint, so that long detail goes into notes instead of breaking the list.
16. As a user on a project page, I want captures there to belong to that project automatically, so that I don't have to tag them.

### Today
17. As a user, I want Today to list overdue, due-today and undated active tasks, in that order, so that I see everything that could need attention.
18. As a user, I want overdue tasks marked with a subtle "Overdue" label, so that I notice them without alarm.
19. As a user, I want tasks in each group ordered by priority, then time, then age, so that the most important thing is on top.
20. As a user, I want an Upcoming section covering the next 7 days, grouped by day, so that I can see what's coming without a second full list.
21. As a user, I want a collapsed Completed section showing what I finished today and how many, so that I can review my progress calmly.
22. As a user with nothing to do, I want "You're all caught up" and a button that focuses Quick Capture, so that the empty screen reassures me and points to the next action.
23. As a user who has finished everything today, I want an all-done message with Upcoming still visible, so that I know I'm done but not blind to tomorrow.
24. As a user who keeps the tab open overnight, I want Today to update after midnight and when I come back to the tab, so that the list is never stale.

### Acting on tasks
25. As a user, I want to tick a checkbox to complete a task and see immediate visual feedback, so that finishing feels clear.
26. As a user, I want to untick a completed task, so that I can undo an accidental completion.
27. As a user, I want a `⋯` menu with Edit, Reschedule, Change priority, Move to project, Archive and Delete, so that secondary actions are available without cluttering the row.
28. As a mobile user, I want the `⋯` button always visible with a comfortable tap target, so that I don't need hover or long-press.
29. As a user, I want Reschedule to offer Today, Tomorrow, This weekend, Next week, Custom date and Remove date, so that moving a task takes one tap.
30. As a user, I want clicking a task's content to open its details, so that I can organise it further.
31. As a user, I want to see subtask progress (e.g. 2/3) on the task row, so that I know how far along a larger task is.

### Task Details
32. As a user, I want to edit the title, with the change saved when I leave the field, so that I never lose an edit or need a Save button.
33. As a user, I want a cleared title to revert to the previous one, so that a task can't end up untitled.
34. As a user, I want to write notes of any length that wrap naturally, so that context has a home.
35. As a user, I want to set, change or remove the due date and time, so that the schedule matches reality.
36. As a user, I want to set priority (None, Low, Medium, High) and have it apply immediately, so that I can reprioritise quickly.
37. As a user, I want to assign, change or remove the project, so that I can reorganise freely.
38. As a user with no projects, I want the project control to explain that none exist yet, so that I'm not confused by an empty list.
39. As a user, I want to add and remove tags, with duplicates and case ignored, so that my tags stay tidy.
40. As a user, I want to add, complete, rename and delete subtasks, so that big tasks become actionable steps.
41. As a user, I want completing every subtask not to complete the parent task, so that I stay in control of when it's done.
42. As a user, I want a quiet "Saved" note after changes, so that I trust the autosave.
43. As a user, I want Archive and Unarchive, so that I can hide a task without destroying it.
44. As a user, I want Delete to ask for confirmation (Enter confirms, Escape cancels), so that I can't delete by accident.
45. As a user opening a task that no longer exists, I want "This task is no longer available" with a way back to Today, so that I never see a broken page.

### Projects
46. As a user, I want to create a project with just a name, so that organising takes no effort.
47. As a user, I want duplicate project names (ignoring case) rejected with an inline message, so that `@project` matching stays predictable.
48. As a user, I want to see each project with its count of active tasks, so that I know how much is left there.
49. As a user, I want to open a project and see its tasks, capture into it, complete tasks and open their details, so that I can work project by project.
50. As a user, I want to rename a project, so that its name stays accurate.
51. As a user, I want deleting a project to leave its tasks intact and unassigned, after confirmation, so that I never lose tasks by tidying projects.
52. As a new user, I want "No projects yet" with a Create project button, so that I understand what projects are for.
53. As a user with an empty project, I want "No tasks in this project" with an Add task button that focuses capture, so that I can fill it immediately.

### All Tasks
54. As a user, I want to see every task in one place, so that nothing is hidden from me.
55. As a user, I want to filter by status (Active, Completed, Archived), priority, project, tag and due date, so that I can find a specific task.
56. As a user, I want to sort by due date, priority, date created or alphabetically, so that the list suits what I'm doing.
57. As a user, I want archived tasks to show up only when I choose them in the status filter, so that the default view stays focused.

### Trust and resilience
58. As a user, I want my tasks and projects to survive refreshes and browser restarts, so that I can rely on Ren.
59. As a user with Ren open in two tabs, I want changes in one tab to appear in the other, so that an old tab never overwrites newer work.
60. As a user whose stored data is unreadable, I want "We couldn't load your tasks" with Try again, so that I'm informed rather than shown a crash.
61. As that same user, I want a Start fresh option that backs up the unreadable data first, so that recovery is possible and nothing is silently destroyed.
62. As a user whose browser blocks or fills up storage, I want a calm "We couldn't save this task. Try again." message, so that I know the save failed.

### Navigation, access and layout
63. As a desktop user, I want a slim sidebar with Today, Projects and All Tasks, showing which one I'm on, so that moving around is effortless.
64. As a mobile user, I want a bottom tab bar with Today, Projects and Tasks, so that every destination is one thumb-tap away.
65. As a keyboard user, I want every control reachable with visible focus, and Escape closing menus and dialogs, so that I never need a mouse.
66. As a screen-reader user, I want labelled controls, proper headings, and state that isn't shown by colour alone, so that I can use Ren fully.
67. As a mobile user, I want wrapping titles, 44px tap targets and no horizontal scrolling, so that Ren is comfortable on a phone.
68. As a user, I want a calm, uncluttered interface with brief purposeful motion, so that Ren lowers my mental load instead of adding to it.

## Implementation Decisions
- **Stack:** Next.js 16 (App Router), React 19, TypeScript in strict mode, Tailwind v4 with CSS-first design tokens, pnpm. The app is client-side only: no backend, no API routes and no authentication. The product name comes from a single `APP_NAME` constant.
- **Layers:** UI → hooks → application core (task service, project service, capture/parser, derived views) → storage layer → localStorage. Only the storage layer touches `localStorage`, and only in client code, never at module scope or during server rendering.
- **Task model:** id, title, notes?, status (`active` | `completed` | `archived`), priority (`none` | `low` | `medium` | `high`), dueDate? (`YYYY-MM-DD`, local), dueTime? (`HH:mm`), projectId?, tags[], subtasks[] (each id, title, completed), createdAt, updatedAt, completedAt?. The **project model** is id, name, createdAt, updatedAt.
- **Field rules:**
  - Titles are trimmed, non-empty and at most 500 characters.
  - Notes have no length cap.
  - Tags are lowercase, have no `#`, contain no duplicates, and use only `[a-z0-9_-]`.
  - Project names are unique, ignoring case.
  - IDs come from `crypto.randomUUID()`.
- **Task service operations:** create, get all, get one, update, complete, uncomplete, reschedule, archive, unarchive, delete. Each operation reads, applies the change, saves, and returns the updated collection. Completing sets `completedAt`; uncompleting clears it.
- **Project service operations:** create, get all, get one, rename, delete. Deleting a project clears `projectId` on its tasks and never deletes them.
- **Capture:** takes the raw input plus options (`ignoreParsing`, `defaultProjectId`), parses it, validates it, and calls create. With `ignoreParsing` set, or when nothing is recognised, the trimmed raw text becomes the title.
- **Parser:** a pure deterministic function, `(input, { today, projects }) → ParsedTaskInput { title, dueDate?, dueTime?, priority?, projectName?, tags? }`. The same function drives the preview line.
  - Date and time phrases are recognised only at the end of the input.
  - `!priority`, `#tag` and `@project` markers are recognised anywhere.
  - A weekday that falls on today means today. "next week" means next Monday. "this weekend" means the coming Saturday.
  - An unmatched `@name` stays in the title.
  - A time with no date means **today**. This is my assumed default; see Further Notes.
- **Derived views**, computed from the task list and an injected "today" and never stored:
  - Today: overdue, then due today, then undated active tasks. Each group is sorted by priority descending, then due time, then `createdAt` ascending.
  - Upcoming: the next 7 days excluding today, grouped by day.
  - Completed: tasks with `completedAt` on today's date.
  - All Tasks: filter and sort helpers. Project counts include active tasks only.
- **Storage:**
  - Keys are `todo-app:tasks` and `todo-app:projects`, each with a `:backup` counterpart.
  - Stored JSON is validated with Zod when it's loaded.
  - Missing data loads as an empty collection.
  - Invalid data produces a load error and is never overwritten. "Start fresh" copies it to the backup key, then resets.
  - Quota and blocked-storage failures become an app-level save error.
  - Other tabs' changes arrive through a subscription to the browser `storage` event.
- **State:** the `useTasks` and `useProjects` hooks hold the collections in React state, expose operations and load/error status, and subscribe to cross-tab changes. There's no global state library. "Today" is recomputed when the tab becomes visible again and at local midnight.
- **Routes:** `/` (Today), `/projects`, `/projects/[id]`, `/tasks` (All Tasks), `/tasks/[id]` (Task Details as a full page).
- **UI components:**
  - Shared primitives: Button (primary, secondary, destructive), Input, Checkbox, Menu, Dialog.
  - A single `TaskItem` with variants.
  - A single `QuickCapture` with a `defaultProjectId` prop.
  - A single date-shortcut component, used by both the row menu and Task Details.
- **Design:**
  - Colour tokens: background `#F8F8F6`, surface `#FFFFFF`, foreground `#181816`, muted `#6B6B66`, border `#E5E5E0`, accent `#3157D5`, success `#2F7D4F`, warning `#A86A12`, danger `#C23B32`.
  - Inter via `next/font`, light theme only.
  - 8px spacing scale, 6/8/10px corner radii.
  - Motion lasts 100–250ms and respects `prefers-reduced-motion`.
- **Dependencies:** Zod (runtime dependency), plus Vitest and jsdom (dev dependencies). No date library.

## Testing Decisions
- **Seam:** there is one, the public interface of the application core (task and project services, capture, parse preview, derived views, load/recovery). Tests run in Vitest with jsdom against real `localStorage`, and "today" is injected so date cases are predictable.
- **What a good test is:** it asserts externally visible behaviour, such as what a call returns, what later reads return, and what the derived views contain. It never asserts internal helpers or the storage format beyond what recovery needs.
- **Cases:**
  - Create: a valid task, an empty title, a 500-character boundary, and optional fields.
  - Complete and uncomplete.
  - Reschedule to Today, Tomorrow, This weekend, Next week, a custom date, and removing the date.
  - Archive and unarchive.
  - Delete.
  - Projects: assigning, changing or removing a project; unique-name rejection; deleting a project keeps its tasks.
  - Tag normalisation.
  - Persistence: save and reload; missing data; malformed JSON; wrong data shape (checking the backup is kept and Start fresh behaves); quota errors.
  - Parser: plain text; every date word; a weekday that is today; times; priority, tag and project markers; an unmatched `@`; a date word mid-title; ignored parsing; a time with no date.
  - Derived views: grouping and order for Today, the Upcoming 7-day window, Completed-today, and midnight rollover through the injected clock.
- **UI:** checked by hand in the browser at mobile and desktop widths, covering the core loop, the empty, error and not-found states, and keyboard-only use. There are no component or end-to-end tests in V1, given the deadline.
- **Prior art:** none yet (the repo is fresh). These tests will set the pattern.

## Out of Scope
- Authentication and accounts, cloud database, cross-device sync, and any backend or API routes.
- AI-assisted parsing (deferred to V2), AI chat, and AI recommendations.
- Recurring tasks, reminders or push notifications, and calendar integration.
- Collaboration and sharing, dashboards and analytics, and gamification.
- Dark mode, and manual drag-to-reorder.
- Parser support for relative phrases ("in 3 days"), absolute dates ("Oct 12") and recurrence.
- Auto-creating projects from `@name`.
- Component and end-to-end tests.

## Further Notes
- **Deadline:** today at 09:00 WAT. Build in the priority order of the implementation plan, keeping the core loop working at every commit: foundation and tokens → core and storage (with tests) → shell → Quick Capture → TaskItem → Today → Task Details → Projects → All Tasks → parser → edge states and polish. If time runs short, All Tasks filtering and sorting and the parser preview are the first things to trim. The data layer and the core loop are not.
- **Assumed default, not confirmed:** a time with no date means today. The preview shows this assumption before submission, so the user can override it.
- The status colours still need a WCAG AA contrast check when the tokens are implemented.
- No issue tracker is configured, which is why the spec lives in `docs/spec.md`. Run `/setup-matt-pocock-skills` to set one up.
