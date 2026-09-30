# Product Brief

## 1. Product Overview

### Product Name

**Ren**

The name is defined once in the codebase (`APP_NAME`) so it can be changed in one place.

### Product Type

A personal task-management web application focused on fast task capture, organization, prioritization, and completion.

### Product Statement

A personal task system that lets users quickly capture thoughts, organize them, understand what needs attention, and reliably get things done.

---

## 2. Product Purpose

The purpose of the application is to help people organize, track, and prioritize tasks so they can reduce mental clutter and increase productivity.

The application acts as an external system for storing and organizing tasks instead of requiring users to keep everything in their working memory.

The product should help users move from:

> "I need to remember this."

to:

> "It's captured. I know what needs my attention."

---

## 3. Problems We Are Solving

### 3.1 Mental Overload

People have a limited amount of working memory.

When users try to remember tasks, ideas, obligations, and things they need to do, that mental load competes with the work they are actually trying to accomplish.

The application provides an external place to capture those thoughts so users don't have to continuously remember them.

---

### 3.2 Lack of Visibility

Tasks and obligations can become scattered across:

- Memory
- Notes
- Messages
- Paper
- Different applications
- Random reminders

This makes it difficult to understand what actually needs attention.

The application provides a structured place where tasks can be captured and reviewed.

---

### 3.3 Analysis Paralysis

Large projects can feel difficult to start when the user only sees the project as one large objective.

The application should allow larger tasks to be broken into smaller actionable steps through subtasks and organization.

The goal is to make the next action easier to identify.

---

## 4. Core User

The initial product is designed for an individual who wants a simple personal system for managing everyday responsibilities, projects, and tasks.

The product is not initially designed as:

- A team project-management platform
- A collaboration tool
- A business analytics dashboard
- A communication platform

V1 is a personal task-management experience.

---

## 5. Core Product Loop

The primary product loop is:

**Capture → Organize → Prioritize → Act → Complete → Review → Capture**

### Capture

Quickly get a thought or obligation into the system.

### Organize

Add useful structure such as projects, tags, due dates, notes, or subtasks.

### Prioritize

Identify what deserves attention.

### Act

Work on the task.

### Complete

Mark the task as finished.

### Review

Understand what remains and what has been completed.

### Capture Again

Return to the system whenever another thought or task needs to be recorded.

---

## 6. Primary User Action

### Quick Capture

Quick Capture is the most important interaction in V1.

A user should be able to open the application, enter a task, submit it, and return to what they were doing within approximately three seconds.

Example:

> Finish the landing page Friday

The application may interpret useful information such as the due date, but interpretation must never prevent the task from being created.

The user's original input should remain safe even if parsing fails.

---

## 7. Secondary User Actions

The secondary actions are:

- Complete a task
- Reschedule a task
- Edit task details
- Organize a task
- Prioritize a task
- View upcoming tasks
- Review completed tasks

---

## 8. V1 Scope

V1 is a frictionless personal task-management application centered around Quick Capture, organization, prioritization, and task completion.

### V1 includes

- Quick task capture
- Today/Home screen
- Task list
- Task completion
- Task editing
- Task details
- Due dates
- Priorities
- Projects
- Tags
- Notes
- Subtasks
- Rescheduling
- Completed tasks
- All Tasks view
- Project-based organization
- Responsive mobile and desktop layouts
- Local Storage persistence
- Deterministic natural-language parsing in Quick Capture
- Empty states
- Loading states
- Error states
- Basic keyboard interactions
- Purposeful interaction animations

---

## 9. V1 Storage

V1 uses **browser Local Storage** for task persistence.

There is no:

- User authentication
- Cloud database
- Account system
- Cloud synchronization
- Server-side task persistence

The application should still separate the UI from the persistence implementation.

The intended flow is:

```text
UI
 ↓
Task Service
 ↓
Local Storage
```

React components should not directly manipulate Local Storage throughout the application.

---

## 10. Natural-Language Parsing

V1 interprets natural-language task input with **deterministic parsing only**.

Example:

```text
Finish the landing page friday at 3pm
```

Could become:

```text
Title: Finish the landing page
Due date: Friday
Due time: 3:00 PM
```

The supported syntax is defined in `screen-spec.md`.

Parsing should not:

- Decide what the user should do
- Create tasks without clear user intent
- Become a required step for creating a task

If parsing produces nothing useful, the application creates a normal task from the user's original input.

### AI

AI-assisted parsing is **deferred to V2**.

When it is introduced, AI remains an enhancement rather than the product: its output is treated as untrusted data, validated before use, and never blocks task creation. See section 14.

---

## 11. Core Screens

V1 contains three primary areas.

### Today

The user's primary workspace.

It contains:

- Page heading
- Quick Capture
- Today's tasks
- Completed tasks
- Upcoming tasks

The primary question this screen answers is:

> "What needs my attention?"

---

### Task Details

The detailed view for an individual task.

It contains:

- Title
- Notes
- Due date
- Priority
- Project
- Tags
- Subtasks
- Completion state
- Archive/delete actions

The primary question this screen answers is:

> "How is this task organized?"

---

### Projects / All Tasks

The organizational area of the application.

It allows users to:

- View projects
- Open project task lists
- View all tasks
- Filter tasks
- Sort tasks
- Organize tasks by project

The primary question this screen answers is:

> "Where do my tasks belong, and what exists in my system?"

---

## 12. Product Principles

### 12.1 Capture Before Organization

Users should be able to capture a thought without first filling out a form.

Organization can happen afterward.

---

### 12.2 Simplicity Over Feature Density

The application should not expose every available capability at once.

Advanced functionality should appear when it is relevant.

---

### 12.3 Calm Over Gamification

The application should help reduce mental clutter.

It should not depend on excessive:

- Badges
- Points
- Streaks
- Confetti
- Gamification
- Decorative animation

Completion should feel satisfying because the user's work is actually getting done.

---

### 12.4 AI Supports the Product

AI should solve a specific user problem.

It should not dictate the interface or become a decorative feature.

---

### 12.5 Every State Matters

The product should deliberately account for:

- Empty states
- Loading states
- Error states
- Completed states
- Long content
- Mobile layouts
- Slow interactions
- Parsing failure

These states are part of the product rather than afterthoughts.

---

### 12.6 One Source of Truth

Components, design tokens, and product decisions should be centralized wherever practical.

The implementation should avoid creating multiple components that perform essentially the same role.

---

## 13. User Experience Goal

The desired user experience can be summarized as:

> **Mind Like Water**

The user should feel that:

- Their thoughts have somewhere to go.
- Their tasks are visible.
- They understand what deserves attention.
- They can quickly capture new thoughts.
- Completing tasks feels clear and satisfying.
- The application does not create unnecessary friction.

The application should become something the user can rely on rather than another source of mental overhead.

---

## 14. V2 Direction

V2 can expand the product beyond the local single-user experience.

Potential V2 capabilities include:

- User authentication
- User accounts
- Cloud database
- Cross-device synchronization
- Push notifications
- Calendar integration
- Recurring tasks
- Offline synchronization
- AI-assisted natural-language parsing
- More advanced natural-language parsing

These features are intentionally excluded from V1.

V1 should first establish the core task-management experience.

---

## 15. Success Criteria

### User Success

The user should be able to:

1. Capture a thought quickly.
2. Understand what needs attention.
3. Organize tasks without unnecessary friction.
4. Complete or reschedule tasks easily.
5. Trust that captured tasks remain available.
6. Return to the application without needing to relearn how it works.

### Product Success

The application should encourage a repeatable daily workflow:

```text
Capture
   ↓
Organize
   ↓
Prioritize
   ↓
Act
   ↓
Complete
   ↓
Review
   ↓
Capture again
```

The ultimate goal is not to maximize the number of features.

The goal is to create a task system that users can reliably integrate into their workflow.

---

## 16. V1 Constraints

The implementation should respect these constraints:

- No authentication in V1.
- No cloud database in V1.
- No unnecessary backend infrastructure.
- Local Storage is the persistence mechanism.
- Quick Capture must remain fast.
- Parsing must not block task creation.
- UI should be responsive.
- Components should be reusable.
- Design tokens should be centralized.
- Motion should communicate meaningful state changes.
- New dependencies should have a clear justification.
- Features outside the defined V1 scope should not be added without a product reason.

---

## 17. Definition of Done

V1 is considered complete when:

### Core functionality

- [ ] User can create a task.
- [ ] User can persist tasks using Local Storage.
- [ ] User can view today's tasks.
- [ ] User can complete a task.
- [ ] User can reschedule a task.
- [ ] User can edit a task.
- [ ] User can delete/archive a task.
- [ ] User can create and use projects.
- [ ] User can view all tasks.
- [ ] User can organize tasks.
- [ ] User can add subtasks.
- [ ] User can add notes.
- [ ] User can assign priorities.
- [ ] User can assign due dates.

### UX

- [ ] Quick Capture is frictionless.
- [ ] Empty states are designed.
- [ ] Loading states are designed where applicable.
- [ ] Error states are designed.
- [ ] Completed-task feedback exists.
- [ ] Mobile layout works.
- [ ] Keyboard interactions work.
- [ ] Long task content is handled correctly.

### Parsing

- [ ] Natural-language task input is parsed deterministically where appropriate.
- [ ] Parsed values are visible before submission and can be ignored.
- [ ] Parser failure does not prevent task creation.

### Design

- [ ] Typography is consistent.
- [ ] Spacing is consistent.
- [ ] Color tokens are centralized.
- [ ] Components are reusable.
- [ ] Animation is purposeful.
- [ ] Accessibility is considered.
- [ ] No unnecessary decorative UI has been introduced.

---

## 18. Source of Truth

This document defines the **product-level requirements** for V1.

Other project documents should not contradict these decisions.

If an implementation decision conflicts with this document, the implementation should be reconsidered before proceeding.

The remaining project documentation defines the visual system, screen behavior, technical architecture, and AI coding rules.
