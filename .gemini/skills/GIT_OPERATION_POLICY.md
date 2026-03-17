# Git Operation Policy

## SKILLS

```yaml
skills:
  git:
    allow_read: true
    allow_write: false
    allow_history_change: false
    allow_execute_commands: false
    suggestion_only: true

  commit:
    standard: conventional_commits
    format: "type(scope): description"
    language: english
    allowed_types:
      - feat
      - fix
      - refactor
      - docs
      - chore
    max_description_length: 50

  workflow:
    steps:
      - generate_code_changes
      - suggest_commit_message
      - suggest_git_commands
```
