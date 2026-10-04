# To-Do List App

A simple, responsive to-do list application to keep track of your daily tasks.

## Features

### Task Management
- **Add tasks** — type in the input field (max 200 characters) and click **Add Task**; empty/whitespace-only tasks are ignored
- **Mark as done** — click the circular checkbox on a task to toggle it between completed and pending
- **Edit tasks** — click a task's text or its ✏️ button to edit inline:
  - **Enter** saves the change
  - **Escape** cancels and restores the original text
  - Clicking away (blur) saves, unless the new text is empty
- **Delete tasks** — remove an individual task with its 🗑️ button

### Toggle Case
- **Toggle case per task** — the **Aa** button flips a task between UPPERCASE and lowercase
- **Toggle Case All** — flips the case of every task at once

### Reset App
- **Clear Completed** — removes all completed tasks at once
- **Reset App** — wipes the input, removes all tasks, and clears persisted data

### Local Storage
- Tasks are saved automatically on every change and restored on page reload
- Storage access is wrapped in try/catch, so the app degrades gracefully (in-memory only) if `localStorage` is unavailable
- First-time visitors (and after **Reset App**) see an empty state: *"No tasks yet. Add one above to get started!"*

### Task Statistics
Live counters displayed in a stats bar:
- **Total** — number of tasks
- **Completed** — tasks marked as done
- **Remaining** — tasks still pending

### UI / Styling
- Green-themed responsive design with smooth animations (slide-in container, fade-in task items) and hover effects
- Scrollable task list with custom scrollbar (max height 400px)
- Responsive breakpoints at 768px and 480px (stacked input, full-width buttons, adjusted sizing)

## Getting Started

```bash
npm install
npm run dev
```
