@AGENTS.md

# CLAUDE.md

## Project Overview

This is a production-minded V1 task management application.

The product helps people:

- quickly capture thoughts
- organize tasks
- understand what needs attention
- prioritize work
- complete or reschedule tasks
- reduce mental clutter

The core product loop is:

```text
Capture → Organize → Prioritize → Act → Complete → Review → Capture
```

The primary interaction is **Quick Capture**.

The product should feel:

- calm
- focused
- fast
- trustworthy
- deliberate

It should not feel like a generic AI-generated SaaS dashboard.

---

# Project Documentation

These documents are the project's source of truth.

**Read the relevant document before making decisions in that area.**

### Product

```text
@product-brief.md
```

Defines:

- what we are building
- why we are building it
- target experience
- V1 scope
- V2 scope
- product principles
- AI's role

### Design

```text
@design-system.md
```

Defines:

- visual direction
- colors
- typography
- spacing
- components
- responsive behavior
- motion
- accessibility
- anti-AI-slop rules

### Screens & UX

```text
@screen-spec.md
```

Defines:

- screen structure
- user flows
- interactions
- keyboard behavior
- responsive behavior
- empty states
- loading states
- error states

### Architecture

```text
@architecture.md
```

Defines:

- application architecture
- folder structure
- data models
- persistence
- task service
- project service
- parser architecture
- state management
- security
- testing

### AI Development Rules

```text
@ai-rules.md
```

Defines:

- how AI should modify the codebase
- component reuse rules
- state management rules
- AI behavior
- error handling
- accessibility
- verification
- anti-patterns

### Implementation Plan

```text
@implementation-plan.md
```

Defines:

- implementation order
- development phases
- dependencies between phases
- V1 definition of done

---

# Source of Truth

Use the documentation above rather than inventing new product or technical decisions.

When working on a task:

- Product question → `@product-brief.md`
- Design question → `@design-system.md`
- Screen/UX question → `@screen-spec.md`
- Architecture question → `@architecture.md`
- AI/code-agent behavior → `@ai-rules.md`
- Implementation order → `@implementation-plan.md`

If a decision is already documented, follow it.

Do not silently replace an existing documented decision with a different approach.

If the user's explicit instruction conflicts with the documentation, follow the user's current instruction and update the relevant documentation when appropriate.

---

# Before You Code

Before making substantial changes:

1. Inspect the existing repository.
2. Read the relevant project documentation using the `@` references above.
3. Understand the existing implementation.
4. Search for reusable components and utilities.
5. Determine which files actually need to change.
6. Check whether the requested feature already exists partially.
7. Confirm that the requested work belongs to V1.

Do not immediately generate a large amount of code.

Understand the existing codebase first.

---

# Existing Code Comes First

Before creating:

- components
- hooks
- utilities
- services
- types
- styles

search the repository for existing implementations.

Prefer extending existing code over creating parallel implementations.

Do not create duplicate components that solve the same problem.

---

# Architecture Rules

The V1 architecture is:

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
Parser
 ↓
Validation
 ↓
Task Service
 ↓
Persistence
```

UI components must not directly manipulate Local Storage.

Do not write:

```ts
localStorage.getItem(...)
localStorage.setItem(...)
localStorage.removeItem(...)
```

inside UI components.

Use the persistence layer defined in:

```text
@architecture.md
```

Task business logic belongs in the task service.

Project business logic belongs in the project service.

---

# V1 Constraints

V1 uses:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Local Storage

V1 does not include:

- authentication
- user accounts
- cloud database
- cloud synchronization
- push notifications
- calendar integration
- collaboration
- team features
- AI chat
- unnecessary backend infrastructure

Do not add these features unless explicitly instructed.

---

# Design Rules

Follow:

```text
@design-system.md
```

The visual direction is:

- minimal
- editorial
- calm
- focused
- restrained

Avoid:

- gradients
- glassmorphism
- decorative blobs
- excessive shadows
- excessive rounded containers
- unnecessary cards
- excessive icons
- fake statistics
- unnecessary charts
- decorative animations
- AI-themed decoration

Do not make something visually complex simply because it is easy for an AI coding agent to generate.

---

# Product Rules

Follow:

```text
@product-brief.md
```

The primary interaction is Quick Capture.

Quick Capture should:

- be prominent
- require minimal friction
- support Enter submission
- clear after successful creation
- immediately update the task list
- persist the task

No required fields should block basic task creation.

---

# Screen & UX Rules

Follow:

```text
@screen-spec.md
```

Do not invent alternative screen structures when the screen specification already defines the behavior.

All relevant states should be implemented:

- empty
- loading
- error
- completed
- missing
- long content
- missing metadata
- storage failure
- parser failure
- AI failure

---

# AI Rules

Follow:

```text
@ai-rules.md
```

AI is an enhancement, not the product.

The application must remain useful without AI.

AI may interpret natural-language task input.

AI must not:

- decide what the user should do
- invent tasks
- invent deadlines
- silently change task meaning
- delete tasks
- replace the task-management experience
- turn the application into a chatbot

All AI output must be validated before entering application logic.

If AI parsing fails, the original user input must still be capable of becoming a normal task.

---

# Implementation Order

Follow:

```text
@implementation-plan.md
```

Do not skip ahead unnecessarily.

Build incrementally.

Each implementation phase should leave the application in a working state.

Do not ask the AI coding agent to build the entire application in one pass.

---

# Component Rules

Before creating a component, search for an existing component that can support the requirement.

Prefer:

```text
TaskItem
```

with variants/props over multiple near-duplicates such as:

```text
TaskCard
TaskRow
TaskListItem
TaskPreview
```

Use one source of truth for reusable UI.

---

# State Management

Prefer:

- React state
- custom hooks
- task service
- project service
- derived state

Do not introduce Redux or another global state solution unless a real requirement emerges.

Avoid duplicated derived state.

---

# Dependencies

Do not install dependencies unnecessarily.

Before adding a package:

1. Check whether the project already has the required functionality.
2. Check whether native browser, React, or Next.js functionality is sufficient.
3. Consider bundle size and maintenance cost.
4. Add the dependency only when it provides meaningful value.

---

# Verification

After implementation:

1. Run type checking.
2. Run linting if configured.
3. Run relevant tests.
4. Check the affected user flow.
5. Check responsive behavior.
6. Check relevant empty/error states.
7. Verify that architecture rules were not violated.
8. Remove unused code and imports.

Never claim something was tested if it was not actually tested.

---

# Communication

After completing a task, report briefly:

### Changed

What was implemented.

### Files

Important files created or modified.

### Verified

What was checked.

### Notes

Anything unresolved.

Keep reports concise.

---

# Final Rule

**Read the relevant project documentation before making decisions.**

**Inspect before modifying.**

**Reuse before creating.**

**Build the smallest correct solution.**

**Verify before moving on.**

The goal is not maximum code.

The goal is a product that feels intentional, calm, fast, trustworthy, and coherent.
