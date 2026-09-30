# Screen Specification

## 1. Purpose

This document defines the structure, behavior, interactions, and states of the application's primary screens.

The screens must follow the product requirements in `product-brief.md` and the visual rules in `design-system.md`.

V1 contains three primary application areas:

1. Today
2. Task Details
3. Projects / All Tasks

Quick Capture is a core interaction used primarily from Today.

---

# 2. Application Navigation

## Desktop

Primary navigation:

```text
Today
Projects
All Tasks
```

Use a slim left sidebar.

The navigation should remain visually simple.

The current route should have a clear active state.

## Mobile

Use a fixed bottom tab bar that provides access to:

```text
Today
Projects
Tasks
```

Avoid overcrowding mobile navigation.

---

# 3. Today Screen

## Purpose

Today is the primary workspace.

It answers:

> What needs my attention?

The screen should prioritize:

1. Quick Capture
2. Today's tasks
3. Completed tasks
4. Upcoming tasks

---

## Layout

Desktop:

```text
┌──────────────┬──────────────────────────────────┐
│              │                                  │
│ Navigation   │ Today                            │
│              │                                  │
│ Today        │ Quick Capture                    │
│ Projects     │                                  │
│ All Tasks    │ Today's Tasks                    │
│              │                                  │
│              │ Task                             │
│              │ Task                             │
│              │ Task                             │
│              │                                  │
│              │ Completed                        │
│              │                                  │
│              │ Upcoming                         │
└──────────────┴──────────────────────────────────┘
```

The main content should have a readable maximum width.

---

# 4. Today Header

The header should contain:

- Page title: `Today`
- Optional contextual date
- Optional short supporting text

The header should not become a dashboard containing statistics.

Example:

```text
Today

Here's what needs your attention.
```

The exact supporting copy can be refined during implementation.

---

# 5. Quick Capture

Quick Capture should appear near the top of the Today screen.

Example:

```text
┌─────────────────────────────────────────────┐
│ +  What needs to get done?              ↵  │
└─────────────────────────────────────────────┘
```

## Behavior

User enters:

```text
Finish the portfolio tomorrow
```

and presses Enter.

The application should:

1. Read the input.
2. Attempt useful interpretation where appropriate.
3. Create the task.
4. Persist it to Local Storage.
5. Clear the input.
6. Update the task list immediately.
7. Return focus to Quick Capture where appropriate.

The capture interaction should not open a separate page.

Titles are capped at 500 characters. Longer detail belongs in notes.

---

# 6. Quick Capture States

## Empty

```text
What needs to get done?
```

## Typing

The input should clearly show focus.

## Submitting

Provide subtle feedback if persistence or parsing requires noticeable time.

Do not create unnecessary blocking UI.

## Success

The new task should appear immediately in the appropriate task list.

## Parsing Failure

The original input should still become a normal task.

The user should never lose their task because parsing failed.

## Empty Submission

Do not create an empty task.

Provide appropriate validation without an intrusive error.

---

# 7. Natural-Language Capture

The system may interpret information from natural-language input.

Example:

```text
Finish landing page Friday at 3pm
```

Potential result:

```text
Title: Finish landing page
Due date: Friday
Due time: 3:00 PM
```

Interpretation should be transparent and reversible.

If the parser is uncertain, prefer preserving the user's original text rather than making a potentially incorrect assumption.

V1 uses deterministic parsing only. AI-assisted parsing is deferred to V2.

## Supported Syntax

Recognized **only at the end** of the input, so titles like "Call Monday Group" stay intact:

| Input                           | Meaning                                                |
| ------------------------------- | ------------------------------------------------------ |
| `today`, `tomorrow`             | That date                                              |
| `mon` … `sun`, `monday` … `sunday` | Next occurrence; the current weekday means today    |
| `next week`                     | Next Monday                                            |
| `this weekend`                  | The coming Saturday                                    |
| `at 3pm`, `3:30pm`, `15:00`     | Due time                                               |

Recognized **anywhere** in the input:

| Input                                    | Meaning                                                                          |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| `!high`, `!med`, `!low` / `!1`, `!2`, `!3` | Priority                                                                       |
| `#tag`                                   | Tag                                                                              |
| `@project`                               | Existing project, matched case-insensitively. If none matches, the text stays in the title. |

Anything else stays in the title. Relative phrases like `in 3 days`, absolute dates like `Oct 12`, and recurrence are not supported in V1.

## Parse Preview

While the user types, a quiet line under Quick Capture shows what was recognized, for example:

```text
Fri · 3:00 PM · #work
```

The preview has a `×` control. Selecting it ignores parsing for this capture, and the raw text becomes the title.

Escape does not dismiss the preview; it keeps its existing meaning.

---

# 8. Today's Task List

The task list displays tasks relevant to today.

The list contains active tasks in three groups, in this order:

1. Overdue — marked with a subtle "Overdue" label.
2. Due today.
3. Undated.

Within each group, tasks are sorted by priority (high first), then due time, then creation time (oldest first). There is no manual reordering in V1.

The list is recalculated when the tab becomes visible again and at local midnight.

Each task should show only the information necessary for quick scanning.

Example:

```text
○ Finish portfolio website
  Tomorrow · Portfolio

○ Review API documentation
  Today · Work

○ Study React Native
  Today · Learning
```

---

# 9. Task Item Interactions

### Checkbox

Clicking the checkbox:

1. Marks the task complete.
2. Persists the change.
3. Updates the UI immediately.
4. Provides subtle completion feedback.

Clicking the checkbox of a completed task marks it active again.

### Task Content

Clicking the task content opens Task Details.

### More Menu

The more menu provides secondary actions such as:

```text
Edit
Reschedule
Change priority
Move to project
Archive
Delete
```

Do not expose all of these actions directly on the task item.

Reschedule uses the same date shortcuts as Task Details (section 19).

---

# 10. Completed Tasks

Completed tasks should remain visible long enough for the user to understand the result.

The Completed section shows tasks completed today. It is collapsed by default and shows its count.

Example:

```text
Completed

✓ Send proposal
✓ Update portfolio
```

Completed tasks may use:

- Reduced visual emphasis
- Muted metadata
- Strikethrough where appropriate

Do not make completed tasks visually identical to active tasks.

---

# 11. Upcoming Tasks

The Today screen shows a lightweight upcoming section below today's work.

It covers active tasks due in the next 7 days, grouped by day.

Example:

```text
Upcoming

Tomorrow · 2 tasks

○ Finish portfolio
○ Call client
```

The section should provide awareness without becoming another full task-management interface.

---

# 12. Today Empty State

When there are no active tasks for today:

```text
You're all caught up.

Nothing needs your attention right now.

[ Capture a task ]
```

The primary action should return the user to Quick Capture.

---

# 13. Today — All Completed State

If all tasks for today are complete:

```text
You're all caught up.

Nothing else needs your attention today.
```

Upcoming tasks can still appear below.

---

# 14. Today — Error State

If task data cannot be loaded from Local Storage:

```text
We couldn't load your tasks.

[ Try again ]
```

Do not expose raw storage errors to the user.

---

# 15. Task Details

## Purpose

Task Details allows the user to organize and modify an individual task.

It is a full page at `/tasks/[id]` on every screen size.

It answers:

> How is this task organized?

---

# 16. Task Details Content

The screen should contain:

```text
Title
Notes
Due date
Priority
Project
Tags
Subtasks
Status
Actions
```

Example:

```text
Finish portfolio website

Due
Tomorrow

Priority
High

Project
Portfolio

Tags
#work #website

Notes
Finish homepage and case studies.

Subtasks
○ Homepage
○ Case study
○ Contact page
```

---

# 17. Editing the Title

The title should be editable.

Changes should be validated before saving.

Task Details autosaves:

- Text fields save when they lose focus.
- Pickers save immediately.
- A quiet "Saved" note confirms the change.

An empty title is not saved; the previous title is restored.

---

# 18. Notes

Notes are optional.

They can contain additional context that does not belong in the task title.

Long notes should wrap naturally.

The interface should not impose unnecessarily short character limits.

---

# 19. Due Date

Supported quick selections:

```text
Today
Tomorrow
This weekend
Next week
Custom date
```

The user should be able to remove an existing due date.

---

# 20. Priority

Supported values:

```text
No priority
Low
Medium
High
```

Changing priority should update the task immediately.

---

# 21. Project

A task can optionally belong to a project.

The user should be able to:

- Assign a project
- Change a project
- Remove the project

If no projects exist, the UI should make that state understandable.

---

# 22. Tags

A task can have multiple tags.

The interface should make adding and removing tags straightforward.

Tags should remain visually secondary to the task title.

---

# 23. Subtasks

A task can contain smaller actionable items.

Example:

```text
Subtasks

○ Build homepage
○ Add case study
○ Add contact page
```

Each subtask should support:

- Completion
- Editing
- Deletion

Subtasks should not become an unnecessarily complex project-management system in V1.

---

# 24. Task Actions

Task Details should support:

```text
Complete
Reschedule
Archive / Unarchive
Delete
```

Delete opens a confirmation dialog. Enter confirms and Escape cancels.

Archiving is not deletion. Archived tasks can be found in All Tasks and unarchived here.

---

# 25. Task Not Found

If a task no longer exists:

```text
This task is no longer available.

[ Back to Today ]
```

Do not render an empty or broken details screen.

---

# 26. Projects / All Tasks

## Purpose

This area provides broader task organization.

It answers:

> Where do my tasks belong?

and:

> What tasks exist in my system?

---

# 27. Projects View

Example:

```text
Projects

Personal
12 tasks

Work
8 tasks

Portfolio
4 tasks

Learning
7 tasks
```

Each project should show enough information to understand its contents without creating unnecessary visual complexity.

Task counts include active tasks only.

---

# 28. Project Creation

The user should be able to create a project.

Minimum information:

```text
Project name
```

Optional project details should not be introduced unless they serve a clear purpose.

Project names must be unique, ignoring case. A conflict shows an inline message:

```text
A project with this name already exists.
```

---

# 29. Project Details

Selecting a project opens its task list.

Example:

```text
Portfolio

4 tasks

○ Build case study
○ Add testimonials
○ Update homepage
✓ Deploy website
```

The user should be able to:

- Add a task
- Complete a task
- Open task details
- Filter/sort tasks where useful

Adding a task uses the same Quick Capture component, pre-assigned to the project.

---

# 30. All Tasks

All Tasks provides a complete view of the user's task system at `/tasks`.

The status filter covers Active, Completed, and Archived.

Possible filters:

```text
Status
Priority
Project
Tag
Due date
```

Possible sorting:

```text
Due date
Priority
Created date
Alphabetical
```

Filters and sorting should remain simple.

Do not build an advanced query-builder interface in V1.

---

# 31. Projects Empty State

If the user has no projects:

```text
No projects yet.

Projects help you organize related tasks.

[ Create project ]
```

---

# 32. Project Empty State

If a project exists but contains no tasks:

```text
No tasks in this project.

[ Add task ]
```

"Add task" moves focus to the project's Quick Capture.

---

# 33. Loading States

Loading states should preserve the expected layout.

Use skeletons where loading is perceptible.

Avoid unnecessary full-screen loading indicators for local operations that should be effectively immediate.

---

# 34. Responsive Behavior

## Mobile

The mobile layout should prioritize:

```text
Page heading
Quick Capture
Tasks
Primary actions
```

Secondary actions should move into contextual menus where appropriate.

Task titles should wrap.

No horizontal scrolling should be required.

---

## Desktop

Desktop may use:

```text
Sidebar
Main content
Optional contextual panel
```

but the additional space should improve usability rather than introduce unnecessary interface elements.

---

# 35. Keyboard Interactions

At minimum:

### Quick Capture

`Enter`

→ Create task

### Escape

Close:

- Dialogs
- Menus
- Other temporary UI

### Navigation

Interactive controls must remain keyboard accessible.

Keyboard support should not rely on mouse-only interactions.

---

# 36. Important Interaction Rules

### Creating a Task

```text
Input
 ↓
Parse if useful
 ↓
Validate
 ↓
Create
 ↓
Persist
 ↓
Update UI
```

### Completing a Task

```text
Checkbox
 ↓
Update state
 ↓
Persist
 ↓
Visual feedback
```

### Editing a Task

```text
Change
 ↓
Validate
 ↓
Persist
 ↓
Update UI
```

### Deleting a Task

```text
Delete
 ↓
Confirmation
 ↓
Delete
 ↓
Persist
 ↓
Update UI
```

---

# 37. State Coverage

The implementation must account for:

- Empty state
- Normal state
- Loading state where applicable
- Error state
- Completed state
- Long titles
- Long notes
- No project
- No tags
- No due date
- No priority
- Parsing success
- Parsing ignored or failed
- Task not found
- Mobile layout
- Desktop layout

---

# 38. Screen Priority

Implementation should happen in this order:

### 1. Today

The core user experience.

### 2. Quick Capture

The primary interaction within Today.

### 3. Task Item

Required for task management.

### 4. Task Details

Adds organization and editing.

### 5. Projects

Adds higher-level organization.

### 6. All Tasks

Adds broader visibility and filtering.

### 7. Edge States

Polish the complete experience.

---

# 39. Out of Scope

Do not add the following to these screens in V1:

- Authentication
- User profiles
- Cloud synchronization
- Team collaboration
- Sharing
- Calendar UI
- Push notification controls
- AI chat
- Analytics dashboards
- Gamification systems

These belong to future product versions unless explicitly reconsidered.

---

# 40. Definition of Screen Completion

A screen is not considered complete merely because the normal state works.

Each screen must be checked for:

- Desktop layout
- Mobile layout
- Empty state
- Error state
- Loading state where applicable
- Long content
- Keyboard interaction
- Accessibility
- Visual consistency
- Interaction feedback
- Local Storage persistence
- Appropriate animation
