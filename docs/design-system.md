# Design System

## 1. Design Direction

The product should feel:

- Calm
- Focused
- Fast
- Trustworthy
- Deliberate
- Minimal

The interface should reduce mental clutter rather than introduce more of it.

### Avoid

- Excessive gradients
- Glassmorphism
- Large decorative illustrations
- Excessive shadows
- Excessive rounded cards
- Multiple competing accent colors
- Decorative animations
- Dashboard-style visual noise
- Unnecessary AI-themed visual elements

Every visual element should have a functional or communicative purpose.

---

# 2. Visual Language

The design direction is a minimal productivity interface with strong typography, generous whitespace, subtle borders, restrained color, and purposeful motion.

The interface should feel closer to a thoughtfully designed productivity tool than a generic SaaS dashboard.

---

# 3. Color System

Use semantic color tokens rather than hardcoded colors throughout components.

## Base Colors

| Token        | Value     | Purpose                     |
| ------------ | --------- | --------------------------- |
| `background` | `#F8F8F6` | Main application background |
| `surface`    | `#FFFFFF` | Cards, inputs, dialogs      |
| `foreground` | `#181816` | Primary text                |
| `muted`      | `#6B6B66` | Secondary text              |
| `border`     | `#E5E5E0` | Borders and dividers        |
| `accent`     | `#3157D5` | Primary interactive color   |

## Semantic Colors

| Token     | Purpose                                  |
| --------- | ---------------------------------------- |
| `success` | Successful completion and positive state |
| `warning` | Warnings and medium-priority information |
| `danger`  | Destructive actions and errors           |

Semantic colors should be used sparingly.

The interface should not become visually dominated by status colors.

---

# 4. Color Usage Rules

### Background

The main application background should use `background`.

### Surfaces

Use `surface` for:

- Inputs
- Dialogs
- Dropdowns
- Important elevated content
- Task detail surfaces where appropriate

Do not turn every section into a separate card.

### Accent

Use `accent` for:

- Primary actions
- Active navigation
- Focus indicators
- Important interactive controls
- Selected states

Do not use the accent color as general decoration.

### Text

Use:

- `foreground` for primary content
- `muted` for supporting information

Do not use light gray text for important information.

---

# 5. Typography

## Font

Primary typeface:

**Inter**

Use one primary typeface throughout the application unless there is a strong product reason to introduce another.

## Scale

| Element         |    Size | Weight |
| --------------- | ------: | -----: |
| Page heading    | 28–32px |    600 |
| Section heading | 18–20px |    600 |
| Task title      | 15–16px |    500 |
| Body            | 14–16px |    400 |
| Metadata        | 12–14px |    400 |
| Button text     |    14px |    500 |

Typography should create hierarchy without relying heavily on color.

---

# 6. Typography Rules

Use typography to establish hierarchy.

Example:

```text
Today
↓
Today's tasks
↓
Finish portfolio website
↓
Tomorrow · Portfolio
```

Do not make every piece of text bold.

Do not use large headings simply to fill space.

Long task titles should wrap naturally rather than being unnecessarily truncated.

---

# 7. Spacing

Use an 8px spacing system.

```text
4px   — very tight spacing
8px   — small spacing
16px  — standard spacing
24px  — section spacing
32px  — larger separation
48px  — major separation
64px  — page-level spacing
```

Prefer existing spacing tokens over arbitrary values.

Avoid introducing values such as:

```text
13px
19px
27px
37px
```

unless there is a specific design reason.

---

# 8. Border Radius

Use restrained rounding.

Suggested scale:

```text
sm   → 6px
md   → 8px
lg   → 10px
```

Use:

- `sm` for small controls
- `md` for inputs and buttons
- `lg` for larger surfaces/dialogs

Avoid excessive pill-shaped UI.

Pill shapes should be reserved for things that semantically behave like badges or tags.

---

# 9. Shadows

Shadows should be subtle.

The default design should rely primarily on:

- Spacing
- Borders
- Contrast
- Typography

rather than large shadows.

Use elevation only when an element needs to visually separate itself from the surrounding interface.

Examples:

- Dialog
- Dropdown
- Floating action surface

Avoid giving every card a shadow.

---

# 10. Buttons

Buttons should have clear hierarchy.

## Primary

Used for the most important action.

Examples:

```text
Save
Create task
Add project
```

Primary buttons use the accent color.

## Secondary

Used for supporting actions.

Examples:

```text
Cancel
Back
```

Secondary buttons should not compete visually with the primary action.

## Destructive

Used for actions such as:

```text
Delete
```

Destructive styling should communicate consequence without dominating the interface.

---

# 11. Inputs

Inputs should be simple and easy to understand.

Default structure:

```text
Label
Input
Supporting information
```

Do not add labels or helper text when they provide no useful information.

Inputs should have:

- Clear focus state
- Visible boundaries
- Comfortable touch area
- Accessible labels
- Error state where necessary

---

# 12. Quick Capture

Quick Capture is the most important input in the product.

It should receive stronger visual emphasis than ordinary inputs.

Example:

```text
┌─────────────────────────────────────────────┐
│ +  What needs to get done?              ↵  │
└─────────────────────────────────────────────┘
```

Characteristics:

- Prominent
- Simple
- Fast
- Keyboard friendly
- Low friction
- No unnecessary fields

Pressing `Enter` should submit the task when appropriate.

The user should not be forced to select:

- Priority
- Project
- Date
- Tags

before creating the task.

Those can be added afterward.

---

# 13. Task Items

Task items should remain visually lightweight.

Example:

```text
○  Finish portfolio website
   Tomorrow · Portfolio
```

The checkbox is the primary completion action.

Clicking the task content should open task details.

Secondary actions should remain hidden until needed.

Avoid turning every task into a large decorative card.

---

# 14. Priority

Priority should communicate importance without overwhelming the interface.

Supported values:

```text
No priority
Low
Medium
High
```

Priority indicators should be subtle.

Do not make the task list look like a wall of red, orange, and blue.

---

# 15. Tags

Tags should be visually secondary.

Example:

```text
#work
#portfolio
#learning
```

Tags can use a subtle badge treatment.

They should not compete with the task title.

---

# 16. Navigation

Desktop navigation should remain simple.

Primary navigation:

```text
Today
Projects
All Tasks
```

Additional navigation should only be introduced when the feature exists and provides meaningful value.

Mobile navigation should prioritize the same core destinations without overcrowding the interface.

---

# 17. Task Completion

Task completion should provide immediate visual feedback.

Before:

```text
○ Finish portfolio
```

After:

```text
✓ Finish portfolio
```

A completed task may:

- Change visual emphasis
- Become slightly muted
- Move into a completed section
- Use a short transition

Do not permanently hide completed tasks immediately without giving the user a clear indication of what happened.

---

# 18. Empty States

Empty states should be intentional.

Example:

```text
You're all caught up.

Nothing needs your attention right now.

[ Capture a task ]
```

Empty states should:

- Explain the current state
- Reassure the user when appropriate
- Provide a useful next action

Avoid decorative empty-state illustrations unless they serve a clear purpose.

---

# 19. Loading States

Loading states should preserve the layout where possible.

Avoid showing a completely blank page while content loads.

Use:

- Skeletons
- Subtle loading indicators
- Disabled states where necessary

Loading feedback should communicate that the application is working.

---

# 20. Error States

Errors should be:

- Understandable
- Specific
- Actionable

Avoid technical messages such as:

```text
Error: Failed to execute mutation.
```

Prefer:

```text
We couldn't save this task.

Try again.
```

Errors should never unnecessarily expose implementation details.

---

# 21. AI Failure State

AI parsing is not required for task creation.

If parsing fails:

```text
User input
    ↓
AI parser fails
    ↓
Create task from original text
```

The application should not show an error that makes the user believe their task was lost.

---

# 22. Motion

Motion should communicate:

- State changes
- Hierarchy
- Continuity
- Feedback

Motion should not exist merely to make the interface look impressive.

Recommended duration:

```text
Fast     → 100–150ms
Normal   → 150–250ms
Slow     → 250–350ms
```

Most everyday interactions should use the fast or normal range.

---

# 23. Motion Examples

### Task completion

```text
Unchecked
   ↓
Checked
   ↓
Subtle visual transition
```

### Task creation

The new task should enter the list naturally.

### Dialog

A dialog can use a short entrance and exit transition.

### Navigation

Transitions should remain subtle and should never delay the user's ability to interact.

---

# 24. Responsive Design

The application should be designed mobile-first.

Supported layouts:

```text
Mobile
Tablet
Desktop
```

Do not simply shrink the desktop layout to fit mobile.

The information hierarchy should remain intact at smaller widths.

---

# 25. Mobile Rules

On mobile:

- Primary actions must remain easy to reach.
- Touch targets should be comfortable.
- Navigation should remain simple.
- Task titles should be allowed to wrap.
- Secondary actions can move into menus.
- Content should not require horizontal scrolling.

Minimum touch target:

**44px**

---

# 26. Desktop Rules

Desktop should use additional horizontal space to improve organization rather than simply making everything larger.

A sidebar can provide primary navigation.

The main content area should maintain a readable maximum width.

Do not stretch task lists across the entire screen unnecessarily.

---

# 27. Accessibility

The interface should target WCAG AA-level accessibility where practical.

Requirements include:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible labels
- Sufficient color contrast
- Meaningful button names
- Proper heading hierarchy
- Appropriate ARIA usage where necessary

Do not rely solely on color to communicate state.

For example, a high-priority task should not be identifiable only because it is red.

---

# 28. Component Principles

Components should have a single clear responsibility.

Prefer:

```text
TaskItem
TaskList
QuickCapture
TaskDetails
ProjectList
```

over components that attempt to manage unrelated functionality.

Use component variants rather than duplicate components.

Example:

```tsx
<Button variant="primary" />
<Button variant="secondary" />
<Button variant="destructive" />
```

instead of creating separate components for each visual variation.

---

# 29. Design Token Principle

Components should consume design tokens rather than hardcoded visual values.

Prefer:

```text
bg-background
text-foreground
border-border
text-muted
```

over repeatedly writing raw color values.

The same principle applies to:

- Spacing
- Radius
- Typography
- Shadows
- Motion

---

# 30. Anti-Slop Rules

Claude Code must not introduce visual elements simply because they are common in AI-generated interfaces.

Do not add:

- Gradient backgrounds
- Decorative blobs
- Unnecessary glass effects
- Excessive cards
- Random icons
- Large hero sections
- Fake statistics
- Unnecessary charts
- Excessive rounded containers
- Excessive animations
- AI-themed decoration

unless explicitly justified by the product requirements.

The interface should remain intentional and restrained.

---

# 31. Design Decision Rule

When deciding between two UI approaches, prefer the option that:

1. Makes the user's task clearer.
2. Reduces friction.
3. Preserves hierarchy.
4. Uses existing components.
5. Requires less visual complexity.

The design should always serve the product rather than the other way around.
