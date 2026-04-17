---
name: git-operation-policy
description: Enforce the repository's conservative Git workflow. Use when a task involves staging, committing, history edits, or suggesting Git commands so operations remain suggestion-first and avoid writes unless the user explicitly requests them.
---

# Git Operation Policy

- Treat Git access as read-oriented by default: inspect status, diffs, and history freely, but avoid write operations unless the user explicitly asks.
- Do not rewrite history, force-push, or alter commit structure unless the user requests that exact action.
- Suggest commands before executing repository-changing Git operations.
- When proposing a commit message, use Conventional Commits in English with the format `type(scope): description`.
- Restrict commit types to `feat`, `fix`, `refactor`, `docs`, and `chore`.
- Keep commit descriptions under 50 characters when possible.
