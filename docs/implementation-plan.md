# Implementation Plan

## Purpose

This document defines the implementation order for V1.

The project should be built incrementally rather than asking an AI coding agent to build the entire application in one pass.

Each phase should leave the application in a working state.

---

# Phase 0 — Inspect and Prepare

Before writing application code:

- inspect the existing repository
- identify the current Next.js version
- inspect the existing folder structure
- inspect installed dependencies
- inspect Tailwind configuration
- inspect existing UI components
- inspect existing global styles
- identify whether a component library is already present
- identify existing utility functions
- identify existing linting and formatting configuration
- identify existing test setup

Do not replace existing project infrastructure unnecessarily.

### Deliverable

A short implementation report containing:

- current stack
- existing structure
- reusable components
- relevant dependencies
- files that will be reused
- files that need to be created

Do not modify application behavior during this phase unless necessary for setup.

---

# Phase 1 — Project Foundation

Set up the core application structure defined in `architecture.md`.

Create or establish:

```text
src/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── task/
│   ├── project/
│   └── capture/
├── hooks/
└── lib/
    ├── storage/
    ├── tasks/
    ├── projects/
    ├── parser/
    └── utils/
```

Only create directories that are actually needed.

Do not create empty folders simply because they appear in the architecture example.

### Deliverable

The application starts successfully with the intended structure.

---

# Phase 2 — Design System Foundation

Implement the visual foundation before building complex screens.

Establish:

- typography
- colors
- spacing
- radius
- borders
- shadows
- focus states
- button styles
- input styles
- responsive foundations

Use the values in `design-system.md`.

The goal is to establish reusable primitives rather than styling every screen independently.

### Deliverable

A small set of reusable UI primitives that can be used throughout the application.

---

# Phase 3 — Data Models

Create the TypeScript models defined in `architecture.md`.

### Task

```ts
type Task = {
  id: string;
  title: string;
  notes?: string;
  status: "active" | "completed" | "archived";
  priority: "none" | "low" | "medium" | "high";
  dueDate?: string;
  dueTime?: string;
  projectId?: string;
  tags: string[];
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};
```

### Project

```ts
type Project = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
```

Add supporting types where necessary.

Avoid prematurely creating types for features outside V1.

### Deliverable

The application has a single source of truth for task and project types.

---

# Phase 4 — Local Storage Layer

Implement the persistence abstraction.

Example responsibilities:

```text
saveTasks()
loadTasks()
removeTasks()

saveProjects()
loadProjects()
removeProjects()
```

Centralize storage keys.

Example:

```text
todo-app:tasks
todo-app:projects
```

Handle:

- missing data
- malformed JSON
- unavailable storage
- storage errors

Components must not access Local Storage directly.

### Deliverable

Tasks and projects can be persisted and retrieved through the storage layer.

---

# Phase 5 — Task Service

Build the application-level task service.

Required operations:

```text
createTask
getTasks
getTask
updateTask
completeTask
rescheduleTask
archiveTask
deleteTask
```

The service should:

1. read current data
2. perform the requested operation
3. persist the result
4. return the updated data

The UI should not contain this business logic.

### Deliverable

Task operations work independently of the UI.

---

# Phase 6 — Project Service

Implement project operations.

Required operations:

```text
createProject
getProjects
getProject
updateProject
deleteProject
```

Handle project/task relationships safely.

For example, deleting a project must not silently delete its tasks.

Tasks should remain valid if their project is removed.

### Deliverable

Projects can be created, updated, retrieved, and removed.

---

# Phase 7 — React Hooks / Application State

Create the minimum hooks required to connect the UI to the application layer.

Potential hooks:

```text
useTasks()
useProjects()
```

Responsibilities may include:

- loading data
- exposing task operations
- exposing project operations
- updating UI after mutations
- managing initialization state
- exposing errors

Avoid global state unless a genuine requirement emerges.

Do not introduce Redux simply because it is familiar.

### Deliverable

UI components can interact with tasks and projects without directly touching persistence.

---

# Phase 8 — Application Layout

Build the global application shell.

Desktop navigation:

```text
Today
Projects
All Tasks
```

Mobile navigation:

```text
Today
Projects
Tasks
```

Implement:

- responsive navigation
- page container
- consistent spacing
- typography hierarchy
- mobile behavior
- active navigation state

Do not add unnecessary dashboard elements.

### Deliverable

Every major screen has a consistent application shell.

---

# Phase 9 — Quick Capture

Build Quick Capture before the rest of the task-management UI.

This is the primary interaction in the product.

Requirements:

- prominent placement
- clear input
- no required fields
- Enter submits
- successful submission clears the input
- task immediately appears in the task list
- task persists across refresh

Example:

```text
Finish the portfolio tomorrow
```

should eventually be interpreted as:

```text
title: Finish the portfolio
dueDate: tomorrow
```

However, the basic task creation flow must work even without AI parsing.

### Deliverable

A user can capture a task in a few seconds.

---

# Phase 10 — Task Item

Build the reusable task item.

It should support:

- checkbox
- title
- metadata
- priority
- due date
- project
- secondary actions
- completed state

Interaction rules:

- checkbox → complete
- clicking task content → details
- secondary actions → menu

Long titles must not break the layout.

### Deliverable

One reusable task component works across Today, Projects, and All Tasks.

---

# Phase 11 — Today Screen

Build the primary workspace.

Structure:

```text
Today
│
├── Quick Capture
│
├── Today's Tasks
│
├── Completed
│
└── Upcoming
```

The screen should answer:

> What needs my attention?

Implement:

- active tasks
- completed tasks
- upcoming tasks
- empty state
- completion interaction
- task navigation
- responsive layout

### Empty state

Use the product language defined in `screen-spec.md`.

### Deliverable

The core Capture → Act → Complete loop works.

---

# Phase 12 — Task Details

Build the task details experience.

Support:

- title
- notes
- due date
- due time
- priority
- project
- tags
- subtasks
- status
- complete
- reschedule
- archive
- delete

Due date shortcuts:

```text
Today
Tomorrow
This weekend
Next week
Custom date
Remove due date
```

Destructive actions must be handled appropriately.

### Deliverable

A user can fully manage an individual task.

---

# Phase 13 — Projects

Build project management.

Support:

- project list
- create project
- project details
- project task list
- rename project
- delete project

Keep project management lightweight.

Do not turn Projects into a second dashboard.

### Deliverable

Users can organize tasks into projects.

---

# Phase 14 — All Tasks

Build the broader task-management screen.

Support:

### Filters

- status
- priority
- project
- tag
- due date

### Sorting

- due date
- priority
- created date
- alphabetical

Avoid building a complex query builder.

The filtering experience should remain understandable.

### Deliverable

Users can find tasks even when they are not on Today.

---

# Phase 15 — Task Parser

Add structured parsing to Quick Capture.

Start with deterministic parsing where practical.

Examples:

```text
Buy milk tomorrow
```

```text
Finish portfolio Friday
```

```text
Call John tomorrow at 3pm
```

The parser should produce:

```ts
type ParsedTaskInput = {
  title: string;
  dueDate?: string;
  dueTime?: string;
  priority?: TaskPriority;
  projectName?: string;
};
```

---

# Phase 16 — AI Parsing

Only introduce AI after normal task creation and deterministic parsing work.

AI should enhance Quick Capture rather than become a dependency.

Flow:

```text
User input
     ↓
Parser
     ↓
AI interpretation if useful
     ↓
Schema validation
     ↓
Parsed task
     ↓
Task service
     ↓
Local Storage
```

If AI fails:

```text
Original input
     ↓
Normal task title
     ↓
Task created
```

The user must never lose their task because the AI parser failed.

---

# Phase 17 — Edge States

Systematically implement the states defined in `screen-spec.md`.

Check:

- empty
- loading
- error
- completed
- missing task
- long title
- long notes
- no project
- no tags
- no priority
- no due date
- invalid stored data
- storage failure
- parser failure
- AI failure

Do not wait until the end to discover these states.

---

# Phase 18 — Responsive Polish

Test every major flow on:

### Mobile

- Today
- Quick Capture
- task details
- projects
- all tasks
- navigation
- menus
- dialogs

### Desktop

- same flows
- wider content
- navigation
- task interaction
- project management

Fix:

- overflow
- spacing
- text wrapping
- touch targets
- navigation behavior
- modal positioning

---

# Phase 19 — Accessibility

Perform an accessibility pass.

Check:

- keyboard navigation
- focus states
- labels
- semantic HTML
- contrast
- buttons
- dialogs
- menus
- form controls
- touch targets

Test the core flow without relying exclusively on a mouse.

---

# Phase 20 — Visual Polish

Only after functionality is stable.

Review:

- spacing consistency
- typography hierarchy
- visual density
- component consistency
- task completion feedback
- empty states
- error states
- responsive behavior
- motion

Remove anything that feels decorative or unnecessary.

The goal is:

> calm, focused, fast, trustworthy, deliberate.

Not:

> feature-heavy, animated, flashy, AI-generated.

---

# Phase 21 — Testing

Test the core product behaviors.

### Task

- create
- read
- edit
- complete
- reschedule
- archive
- delete

### Organization

- create project
- assign project
- remove project
- filter
- sort

### Persistence

- refresh browser
- close and reopen
- malformed storage data
- storage failure

### Parser

- normal input
- date input
- time input
- priority input
- parser failure
- AI failure

---

# Phase 22 — Final Product Review

Review the product against the original goal.

Ask:

### Capture

Can a user capture a thought within a few seconds?

### Organization

Can they understand where their tasks belong?

### Prioritization

Can they see what requires attention?

### Action

Can they complete or reschedule a task without friction?

### Trust

Does the application reliably preserve their tasks?

### Calm

Does the interface reduce mental clutter rather than create more?

### Coherence

Do all screens feel like the same product?

---

# Phase 23 — V1 Definition of Done

V1 is complete when:

- [ ] application runs reliably
- [ ] Today works
- [ ] Quick Capture works
- [ ] tasks persist in Local Storage
- [ ] tasks can be completed
- [ ] tasks can be edited
- [ ] tasks can be deleted
- [ ] tasks can be archived
- [ ] due dates work
- [ ] priorities work
- [ ] projects work
- [ ] tags work
- [ ] notes work
- [ ] subtasks work
- [ ] All Tasks works
- [ ] filtering works
- [ ] sorting works
- [ ] responsive layouts work
- [ ] empty states work
- [ ] error states work
- [ ] parser works
- [ ] AI failure does not block task creation
- [ ] keyboard interactions work
- [ ] accessibility pass completed
- [ ] no unnecessary dependencies were introduced
- [ ] no direct Local Storage access exists inside UI components
- [ ] business logic is not duplicated
- [ ] visual design follows `design-system.md`
- [ ] application does not look like a generic AI-generated dashboard

---

# Implementation Order Summary

The recommended order is:

```text
1. Inspect repository
        ↓
2. Foundation
        ↓
3. Design system
        ↓
4. Data models
        ↓
5. Local Storage
        ↓
6. Task service
        ↓
7. Project service
        ↓
8. Hooks/state
        ↓
9. Application layout
        ↓
10. Quick Capture
        ↓
11. Task Item
        ↓
12. Today
        ↓
13. Task Details
        ↓
14. Projects
        ↓
15. All Tasks
        ↓
16. Deterministic Parser
        ↓
17. AI Parser
        ↓
18. Edge States
        ↓
19. Responsive Polish
        ↓
20. Accessibility
        ↓
21. Visual Polish
        ↓
22. Testing
        ↓
23. Final Review
```

The most important rule:

**Do not ask Claude Code to build the entire application in one prompt.**

Give it one coherent phase at a time.

Each phase should be implemented, inspected, and verified before moving to the next.
