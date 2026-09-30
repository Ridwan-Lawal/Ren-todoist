# Architecture

## 1. Architecture Overview

V1 is intentionally a simple client-side application.

The architecture is:

```text
┌──────────────────────────┐
│        Next.js UI        │
│                          │
│  Today                   │
│  Task Details            │
│  Projects / All Tasks    │
└────────────┬─────────────┘
             │
             ↓
┌──────────────────────────┐
│       Task Service       │
│                          │
│ createTask()             │
│ updateTask()             │
│ completeTask()           │
│ deleteTask()              │
│ rescheduleTask()          │
│ getTasks()               │
└────────────┬─────────────┘
             │
             ↓
┌──────────────────────────┐
│       Local Storage      │
│                          │
│       Browser            │
└──────────────────────────┘
```

The UI must not directly manipulate Local Storage.

The Task Service provides the boundary between the interface and persistence.

---

# 2. Technology Stack

## Frontend

Use:

- Next.js
- React
- TypeScript
- Tailwind CSS

Use the existing project's component/UI system where appropriate.

## Persistence

V1 uses:

**Browser Local Storage**

No database is required.

## AI

AI is optional within the task-capture pipeline and should be isolated behind a parser interface.

## Validation

Use TypeScript for compile-time type safety.

Use schema validation where runtime validation is required, particularly for AI-generated structured data.

---

# 3. Application Layers

The application should conceptually contain four layers:

```text
UI
 ↓
Application / Task Logic
 ↓
Persistence
 ↓
Local Storage
```

AI parsing is a supporting service:

```text
Quick Capture
      ↓
Task Parser
      ↓
Task Logic
      ↓
Persistence
```

The UI should not need to know how the parser or persistence layer works internally.

---

# 4. Recommended Project Structure

A reasonable initial structure:

```text
src/
├── app/
│   ├── page.tsx
│   ├── projects/
│   │   └── page.tsx
│   └── tasks/
│       └── [id]/
│           └── page.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── task/
│   ├── project/
│   └── capture/
│
├── lib/
│   ├── storage/
│   │   └── local-storage.ts
│   ├── tasks/
│   │   ├── task-service.ts
│   │   └── task-types.ts
│   ├── projects/
│   │   └── project-service.ts
│   ├── parser/
│   │   └── task-parser.ts
│   └── utils/
│
└── hooks/
    ├── use-tasks.ts
    └── use-projects.ts
```

The exact structure can change if the implementation demonstrates a clear reason.

Do not create directories merely for the sake of architectural complexity.

---

# 5. Task Domain Model

A V1 task should contain:

```ts
type Task = {
  id: string;
  title: string;
  notes?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  dueTime?: string;
  projectId?: string;
  tags: string[];
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};
```

Status:

```ts
type TaskStatus = "active" | "completed" | "archived";
```

Priority:

```ts
type TaskPriority = "none" | "low" | "medium" | "high";
```

Subtask:

```ts
type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};
```

---

# 6. Project Model

A project should remain simple.

```ts
type Project = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
```

Tasks reference projects through:

```ts
projectId?: string
```

Do not duplicate project information inside every task.

---

# 7. Local Storage

Use a single controlled storage boundary.

For example:

```text
todo-app:tasks
todo-app:projects
```

The exact keys should be centralized rather than repeated throughout the codebase.

Example:

```ts
const STORAGE_KEYS = {
  tasks: "todo-app:tasks",
  projects: "todo-app:projects",
};
```

Only the storage layer should directly call:

```ts
localStorage.getItem();
localStorage.setItem();
localStorage.removeItem();
```

---

# 8. Browser Environment

Local Storage only exists in the browser.

The application must therefore avoid accessing `localStorage` during server rendering.

Do not execute:

```ts
localStorage.getItem(...)
```

at module scope or in server components.

Storage access should occur from client-side code through the designated storage layer.

---

# 9. Storage Serialization

Tasks and projects are stored as JSON.

Example:

```text
Task[]
   ↓
JSON.stringify()
   ↓
Local Storage
```

Reading:

```text
Local Storage
   ↓
JSON.parse()
   ↓
Task[]
```

Parsed data must be validated before being treated as application state where appropriate.

---

# 10. Storage Failure Handling

The application should account for:

- Missing storage data
- Invalid JSON
- Unexpected data shape
- Storage quota errors
- Browser storage restrictions

A malformed stored value should not cause the entire application to crash.

If stored data cannot be safely recovered, the application should fail gracefully and communicate the problem appropriately.

---

# 11. Task Service

Components should interact with tasks through a task service rather than directly manipulating Local Storage.

Example interface:

```ts
createTask(input);
getTasks();
getTask(id);
updateTask(id, updates);
completeTask(id);
rescheduleTask(id, date);
archiveTask(id);
deleteTask(id);
```

The service owns task-related business logic.

---

# 12. Why the Task Service Exists

Without a service boundary, components may eventually contain logic such as:

```text
Today
 ↓
localStorage
 ↓
JSON.parse
 ↓
filter
 ↓
sort
 ↓
update
```

and another component may repeat the same logic.

Instead:

```text
Today
 ↓
Task Service
 ↓
Storage
```

This keeps the UI focused on presentation and interaction.

---

# 13. Task Creation Flow

The task creation flow is:

```text
User Input
    ↓
Quick Capture
    ↓
Task Parser
    ↓
Validated Task Input
    ↓
Task Service
    ↓
Local Storage
    ↓
UI Update
```

The parser is optional.

If parsing does not produce useful information, the task can still be created from the original input.

---

# 14. Task Parser

The parser should expose a simple interface.

Conceptually:

```ts
type ParsedTaskInput = {
  title: string;
  dueDate?: string;
  dueTime?: string;
  priority?: TaskPriority;
  projectName?: string;
};
```

The UI should not depend on whether parsing is performed by:

- deterministic code
- an AI model
- a combination of both

This allows the implementation to evolve without redesigning Quick Capture.

---

# 15. Deterministic Parsing First

Where straightforward rules can reliably handle input, ordinary code should be preferred.

For example:

```text
"Finish portfolio tomorrow"
```

can potentially be handled without an AI model.

AI should be introduced where it provides meaningful additional interpretation rather than simply because the application is described as AI-enabled.

---

# 16. AI Parsing

If an AI model is used, its output must be structured.

Example:

```json
{
  "title": "Finish portfolio",
  "dueDate": "2026-10-01",
  "dueTime": null,
  "priority": "none"
}
```

The exact schema should be defined in the parser implementation.

AI output should never be blindly trusted.

---

# 17. AI Validation

The flow should be:

```text
AI
 ↓
Structured Output
 ↓
Runtime Validation
 ↓
Parsed Task Input
 ↓
Task Service
```

Invalid AI output must not directly modify application state.

If validation fails:

```text
AI parsing failed
       ↓
Use original user input
       ↓
Create normal task
```

---

# 18. State Management

V1 should avoid unnecessary global state.

Task state can initially be managed through:

- React state
- Custom hooks
- Task Service

For example:

```text
useTasks()
    ↓
Task Service
    ↓
Local Storage
```

A global state library should only be introduced if the application develops a genuine requirement for one.

Do not add Redux or another state-management library simply because it is familiar.

---

# 19. Derived State

Values such as:

```text
Today's tasks
Completed tasks
Upcoming tasks
High-priority tasks
Tasks in a project
```

should generally be derived from the underlying task collection rather than stored separately.

For example:

```text
All Tasks
   ↓
filter(status === "active")
   ↓
Today
```

This avoids multiple sources of truth.

---

# 20. Task Dates

Store dates in a consistent machine-readable format.

Do not store presentation strings such as:

```text
"Tomorrow"
"Next week"
```

as the actual task date.

Those are presentation concepts.

The underlying data should represent the actual date.

The UI can then display:

```text
Tomorrow
Friday
Oct 4
```

depending on context.

---

# 21. IDs

Tasks, projects, and subtasks require stable unique identifiers.

The implementation should use a reliable ID-generation strategy.

IDs should not depend on array positions.

Do not use:

```text
0
1
2
```

as permanent task identifiers.

---

# 22. Persistence and UI Synchronization

After a successful mutation:

```text
User action
 ↓
Task Service
 ↓
Local Storage updated
 ↓
Application state updated
 ↓
UI reflects new state
```

The user should receive immediate feedback.

Because Local Storage is local, ordinary task mutations should feel effectively instant.

---

# 23. Optimistic Interaction

For local operations such as completing a task, the interface can update immediately because the persistence operation is local.

Example:

```text
○ Task
   ↓ click
✓ Task
```

The application should still handle persistence failures gracefully.

---

# 24. Delete Behavior

Deleting a task should:

1. Require confirmation when appropriate.
2. Remove the task from persistence.
3. Remove it from application state.
4. Update the UI.

Do not leave stale task data visible after deletion.

---

# 25. Archive Behavior

Archiving should change task status rather than destroying the task.

Example:

```text
active
  ↓
archived
```

Archived tasks should not appear in the default Today list.

---

# 26. Project Relationships

Projects should not own duplicated task objects.

Relationship:

```text
Project
   ↑
   │ projectId
   │
Task
```

This allows a task to move between projects without duplicating the task.

A task may also have no project.

---

# 27. V1 Data Flow

### Create

```text
QuickCapture
     ↓
useTasks()
     ↓
createTask()
     ↓
LocalStorage
     ↓
Task state
     ↓
UI
```

### Complete

```text
TaskItem
     ↓
completeTask()
     ↓
LocalStorage
     ↓
Task state
     ↓
UI
```

### Edit

```text
TaskDetails
     ↓
updateTask()
     ↓
LocalStorage
     ↓
Task state
     ↓
UI
```

---

# 28. V2 Migration Strategy

V2 may introduce:

```text
Authentication
      ↓
API
      ↓
Database
```

The UI should ideally continue interacting with application-level services rather than directly with the database.

Current:

```text
UI
 ↓
Task Service
 ↓
Local Storage
```

Future:

```text
UI
 ↓
Task Service
 ↓
API
 ↓
Database
```

The goal is to minimize changes to the UI when persistence moves to the server.

---

# 29. Security

Although V1 does not have authentication or sensitive server-side data, basic security practices still apply.

Do not:

- Put secret API keys in client-side code.
- Trust AI-generated data blindly.
- Render untrusted content as raw HTML.
- Store secrets in Local Storage.
- Expose server credentials through browser code.

If an external AI provider is used through an API requiring a secret key, the key must not be shipped to the client.

---

# 30. Performance

V1 should remain lightweight.

Avoid:

- Unnecessary dependencies
- Excessive client components
- Large UI libraries when existing components are sufficient
- Repeated Local Storage reads
- Unnecessary re-renders
- Heavy animation libraries for simple transitions

The application should feel immediate during normal task operations.

---

# 31. Error Handling

Errors should be handled at the appropriate layer.

```text
Storage error
     ↓
Storage layer
     ↓
Task service
     ↓
UI
```

The UI should receive an understandable application-level error rather than a low-level implementation error.

---

# 32. Testing Strategy

At minimum, test the task logic independently from the UI.

Important cases include:

### Task creation

- Valid task
- Empty title
- Duplicate titles
- Optional fields

### Completion

- Active → completed
- Completed → active if supported

### Dates

- Today
- Tomorrow
- Custom date
- No date

### Projects

- Assign project
- Change project
- Remove project

### Persistence

- Save
- Load
- Invalid stored data
- Missing stored data

### Parser

- Plain task
- Task with date
- Task with time
- Invalid parser output
- Parser failure

---

# 33. Architecture Rules

The following rules are mandatory unless there is a documented reason to change them:

1. React components must not directly manipulate Local Storage.
2. Task logic belongs in the task/application layer.
3. Storage logic belongs in the storage layer.
4. AI parsing belongs behind a parser interface.
5. AI output must be validated.
6. Derived state should not become a second source of truth.
7. UI should not depend on a specific persistence implementation.
8. Do not introduce global state without a demonstrated requirement.
9. Do not introduce dependencies without justification.
10. Keep V1 simpler than V2.

---

# 34. Architecture Goal

The architecture should be simple enough to understand quickly but structured enough to evolve.

The target is:

```text
                ┌───────────────┐
                │      UI       │
                └───────┬───────┘
                        │
                ┌───────▼───────┐
                │ Application    │
                │ / Task Logic   │
                └───────┬───────┘
                        │
             ┌──────────┴──────────┐
             │                     │
      ┌──────▼──────┐       ┌──────▼──────┐
      │   Parser    │       │  Storage    │
      │             │       │             │
      │ AI / Rules  │       │ LocalStorage │
      └─────────────┘       └─────────────┘
```

V1 should not contain architectural complexity that exists only for hypothetical future requirements.
