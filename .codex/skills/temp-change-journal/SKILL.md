---
name: temp-change-journal
description: Record a lightweight task journal in `.temp` after completing a user request. Use when you finish an implementation task and need to leave a disposable Markdown note describing what changed, why it changed, and the key design rationale.
---

# Temp Change Journal

- Ensure `.temp/` exists before writing the journal file.
- After completing the task, create one Markdown file in `.temp/` for that task.
- Use a timestamped or date-prefixed filename that makes separate task notes easy to sort.
- Keep the note short and practical; do not dump full diffs or long command logs.
- Include these sections in order:
  - `# Task`
  - `## Changes`
  - `## Design Rationale`
  - `## Follow-up`
- In `Changes`, summarize the concrete files, behaviors, or workflows that changed.
- In `Design Rationale`, explain the durable reasoning behind the implementation choices.
- In `Follow-up`, note optional cleanup or next actions, including whether the user may delete the file after review.
