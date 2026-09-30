# AI Rules

## Purpose

This document defines how AI coding agents, especially Claude Code, must work on this project.

The AI is an **implementation partner**, not the product designer or product owner.

It must follow the project's existing product decisions, design system, screen specifications, and architecture rather than inventing alternatives.

The source of truth is:

1. `product-brief.md` — what we are building and why
2. `design-system.md` — how the product should look and behave visually
3. `screen-spec.md` — what each screen and interaction should do
4. `architecture.md` — how the application should be structured
5. `ai-rules.md` — how AI should modify and reason about the codebase

When these documents already answer a question, do not invent a different solution.

---

# 1. General AI Behavior

Before making changes:

- Inspect the existing codebase.
- Understand the current architecture.
- Identify existing reusable components.
- Identify existing utilities, hooks, types, and services.
- Read the relevant project documentation.
- Check whether the requested functionality already exists partially.
- Prefer modifying existing code over creating parallel implementations.

Do not immediately start coding based only on the user's last sentence.

First understand the surrounding implementation.

---

# 2. Source of Truth

When making decisions, use this priority:

### Product decisions

`product-brief.md`

Defines:

- product purpose
- target experience
- core loop
- V1 scope
- V2 scope
- product principles
- AI's role

### Design decisions

`design-system.md`

Defines:

- colors
- typography
- spacing
- component appearance
- interaction states
- motion
- responsive behavior
- accessibility expectations

### Screen behavior

`screen-spec.md`

Defines:

- screen structure
- user flows
- interactions
- empty states
- loading states
- error states
- mobile behavior
- keyboard behavior

### Technical decisions

`architecture.md`

Defines:

- application layers
- data models
- persistence
- task services
- parser architecture
- state management
- project structure

Do not override these decisions without an explicit instruction from the user.

---

# 3. Do Not Invent Product Requirements

Do not add features simply because they are common in task-management applications.

Examples of features that should NOT be added automatically:

- authentication
- accounts
- cloud synchronization
- push notifications
- calendar integration
- recurring tasks
- collaboration
- team features
- chat
- dashboards
- analytics
- gamification
- AI chat
- AI-generated task recommendations

These are outside the V1 scope unless explicitly requested.

If a feature appears useful but is outside the documented scope, mention it rather than silently implementing it.

---

# 4. V1 Technical Constraints

V1 uses:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Local Storage

V1 does NOT use:

- authentication
- cloud database
- backend persistence
- user accounts
- server-side task storage
- unnecessary global state

The application must work entirely from the browser.

Local Storage access must happen through the persistence layer.

Components must not directly call:

```ts
localStorage.getItem(...)
localStorage.setItem(...)
localStorage.removeItem(...)
```

Instead, use the storage abstraction defined by the architecture.

---

# 5. Reuse Before Creating

Before creating a component:

1. Search for an existing component that performs the same or similar role.
2. Check whether it can support the new use case through props or variants.
3. Reuse it if possible.
4. Only create a new component when the existing component genuinely cannot support the requirement.

Avoid creating near-duplicate components such as:

```text
TaskCard
TaskItem
TaskRow
TaskListItem
TaskPreview
```

when one well-designed task component could serve the different contexts.

Prefer:

```text
TaskItem
```

with controlled variants or props when appropriate.

---

# 6. One Source of Truth

There should be one source of truth for:

- task data
- project data
- design tokens
- reusable UI components
- task business logic
- persistence
- parsing

Do not duplicate business logic across components.

For example, do not implement task completion separately in:

```text
Today
Task Details
Projects
All Tasks
```

All completion behavior should use the task service.

The UI should trigger the action.

The service should own the business operation.

---

# 7. Keep Components Focused

Components should have clear responsibilities.

Prefer:

```text
TaskItem
QuickCapture
TaskDetails
ProjectList
TaskFilters
```

over large components that contain:

- UI
- persistence
- parsing
- business logic
- date manipulation
- filtering
- local storage operations

Keep application logic outside presentational components where practical.

---

# 8. Do Not Duplicate State

Avoid storing information that can be derived.

For example, do not maintain separate state such as:

```ts
const [activeTasks, setActiveTasks] = ...
const [completedTasks, setCompletedTasks] = ...
const [upcomingTasks, setUpcomingTasks] = ...
```

if all of these can be derived from the underlying task collection.

Prefer:

```text
tasks
    ↓
derived active tasks
derived completed tasks
derived upcoming tasks
derived filtered tasks
```

This reduces synchronization bugs.

---

# 9. UI Must Follow the Design System

Do not invent random:

- colors
- spacing
- font sizes
- border radii
- shadows
- button styles
- card styles
- animations

Use the tokens and rules defined in `design-system.md`.

The product should feel like one coherent system.

Avoid visual decisions that make the application look like a generic AI-generated SaaS dashboard.

---

# 10. Anti-AI-Slop Rules

Do not add decorative UI simply to make the interface look impressive.

Avoid:

- unnecessary gradients
- glowing effects
- glassmorphism
- floating blobs
- excessive rounded cards
- excessive shadows
- decorative illustrations
- fake statistics
- unnecessary charts
- excessive icons
- excessive animations
- large empty hero sections
- AI-themed visual decoration
- random accent colors

Every visual element should have a product purpose.

When deciding between:

**A. visually impressive but unnecessary**

and

**B. simpler and clearer**

choose B.

---

# 11. Motion

Animations must communicate something.

Good uses:

- task completion feedback
- opening/closing dialogs
- menu transitions
- adding/removing tasks
- state changes
- navigation transitions

Avoid animation simply because a library makes it easy.

Motion should be:

- subtle
- fast
- purposeful
- consistent

Follow the timing defined in `design-system.md`.

Do not introduce a new animation library unless there is a clear reason.

---

# 12. Responsive Design

Build mobile-first.

Every feature must be considered at:

- mobile
- tablet
- desktop

Do not treat mobile responsiveness as a final cleanup step.

Important mobile principles:

- touch targets should be large enough
- important actions should remain easy to reach
- avoid horizontal overflow
- avoid desktop-only interaction patterns
- preserve the Quick Capture experience

---

# 13. Accessibility

Accessibility is part of the implementation, not a later enhancement.

Use:

- semantic HTML
- proper labels
- keyboard interaction
- visible focus states
- accessible buttons
- appropriate ARIA only when necessary
- sufficient contrast
- touch-friendly controls

Interactive elements should be understandable without relying exclusively on color or icons.

---

# 14. Edge Cases Are Required

Do not implement only the successful/default state.

Consider:

### Empty

No tasks.

### Loading

Data is being initialized or loaded.

### Error

Something failed.

### Long content

Very long task titles or notes.

### Missing metadata

Task has:

- no priority
- no project
- no tags
- no due date

### Completed

Task has been completed.

### Missing task

Requested task no longer exists.

### Storage failure

Local Storage is unavailable or contains invalid data.

### Parser failure

The parser fails or returns invalid data.

The application should degrade gracefully.

---

# 15. AI Rules

AI is an enhancement to the product.

AI must never become the product itself.

The application must remain useful if AI is unavailable.

For Quick Capture parsing:

```text
User input
    ↓
Parser
    ↓
Structured result
    ↓
Validation
    ↓
Task creation
```

If AI parsing fails:

```text
Original user input
        ↓
Normal task title
        ↓
Task created
```

Never lose the user's task because an AI request failed.

---

# 16. AI Output Must Be Structured

Never rely on arbitrary AI-generated prose when the application expects structured data.

Expected parser output should conform to the defined type:

```ts
type ParsedTaskInput = {
  title: string;
  dueDate?: string;
  dueTime?: string;
  priority?: TaskPriority;
  projectName?: string;
  tags?: string[];
};
```

AI output must be validated at runtime before it enters application logic.

Invalid output must not silently corrupt application state.

---

# 17. AI Must Not Make Product Decisions

AI may interpret:

> Finish the portfolio tomorrow

into structured task information.

AI should not decide:

> You should work on your portfolio instead of your other tasks.

AI should not:

- prioritize the user's life automatically
- create tasks without clear user intent
- delete tasks
- change task meaning
- invent deadlines
- invent projects
- invent requirements

AI interprets input.

The user remains in control.

---

# 18. Dates and Times

Store dates in machine-readable formats.

Do not store presentation-specific strings such as:

```text
Tomorrow
Next Monday
This weekend
```

as the actual task date.

The UI can display:

```text
Tomorrow
Monday
Oct 12
```

but the underlying data should remain machine-readable.

Be careful with timezone and date parsing.

Do not introduce date libraries unnecessarily.

---

# 19. Error Handling

Errors should be:

- understandable
- actionable
- calm
- non-technical where shown to users

Avoid exposing raw errors such as:

```text
TypeError: Cannot read properties of undefined
```

Instead provide a useful message and, where appropriate, a retry action.

Do not silently swallow errors.

---

# 20. Destructive Actions

Deleting or permanently removing data should not happen accidentally.

For destructive actions:

- provide clear action labels
- use confirmation where appropriate
- avoid ambiguous icons
- provide a safe cancellation path

Completion is not deletion.

Archiving is not deletion.

Keep these concepts distinct.

---

# 21. Dependencies

Do not install a package simply because it makes a small task slightly easier.

Before adding a dependency:

1. Check whether the project already has a suitable solution.
2. Check whether the feature can be implemented simply with existing tools.
3. Consider bundle size and maintenance cost.
4. Add the dependency only if it provides meaningful value.

Avoid dependency creep.

---

# 22. File Structure

Respect the architecture defined in `architecture.md`.

Do not create random folders because they are convenient for a single feature.

When adding functionality, place it according to its responsibility.

Examples:

```text
components/task/
```

for task UI.

```text
lib/tasks/
```

for task-related application logic.

```text
lib/storage/
```

for persistence.

```text
hooks/
```

for reusable React hooks.

---

# 23. Before Editing

Before modifying code, determine:

- What file owns this behavior?
- Is there already a reusable component?
- Is there already a service?
- Is there already a hook?
- Is there already a type?
- Is there already a design token?
- Does the requested behavior belong to V1?

If the answer is yes, reuse it.

---

# 24. Before Creating New Components

Ask:

> Can an existing component handle this through props, composition, or a variant?

If yes, extend the existing component.

If no, create a new component with a clear responsibility.

Do not create components merely to reduce file length.

---

# 25. Verification

After implementation, verify:

### Functionality

- Does the feature actually work?
- Does data persist?
- Does editing work?
- Does completion work?
- Does deletion behave correctly?

### UI

- Does it follow the design system?
- Does it work on mobile?
- Does it work on desktop?
- Are states handled?

### Architecture

- Did the component bypass the service layer?
- Was Local Storage accessed directly?
- Was business logic duplicated?
- Were unnecessary dependencies introduced?

### Accessibility

- Can the feature be used with a keyboard?
- Are controls labelled?
- Are focus states visible?
- Are touch targets appropriate?

### Error handling

- What happens if storage fails?
- What happens if the task does not exist?
- What happens if AI parsing fails?

---

# 26. Testing Expectations

Prioritize tests around behavior rather than implementation details.

Important behaviors include:

- creating a task
- completing a task
- editing a task
- deleting a task
- archiving a task
- setting a due date
- setting priority
- assigning a project
- persistence across refresh
- parser behavior
- parser failure fallback

Do not write tests solely to increase test count.

---

# 27. Development Workflow

For each requested feature:

### Step 1 — Inspect

Understand the existing implementation.

### Step 2 — Plan

Identify:

- affected files
- reusable components
- required logic
- state changes
- edge cases

### Step 3 — Implement

Make the smallest coherent change.

### Step 4 — Verify

Check:

- functionality
- responsiveness
- accessibility
- design consistency
- architecture

### Step 5 — Clean up

Remove:

- dead code
- duplicate logic
- unused imports
- temporary hacks
- unnecessary dependencies

### Step 6 — Report

Briefly explain:

- what changed
- what files changed
- what was verified
- anything that remains unresolved

---

# 28. Do Not Over-Engineer V1

The goal is a polished product, not an unnecessarily complex architecture.

Do not introduce:

- Redux without a real need
- complex state machines
- elaborate repository patterns
- unnecessary backend abstractions
- microservices
- event buses
- complex caching
- premature optimization

Keep the architecture clean enough to evolve into V2.

---

# 29. When Requirements Are Ambiguous

Do not silently make major product decisions.

If ambiguity materially affects:

- product behavior
- data model
- architecture
- user flow
- design direction

ask for clarification.

For small implementation details, use the existing project conventions and choose the simplest solution consistent with the documentation.

---

# 30. Final Principle

The goal is not to produce the most code.

The goal is to produce a product that feels:

- intentional
- calm
- fast
- trustworthy
- coherent
- useful

Every implementation decision should support that goal.

**Build less. Reuse more. Make every interaction intentional.**
