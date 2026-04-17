---
name: skill-maintainer
description: Analyze user instructions and keep the local skill library current. Use after a request reveals a repeatable workflow, policy, or project convention that should be captured by creating a new skill or updating an existing skill under `.codex/skills`.
---

# Skill Maintainer

- Inspect the request and capture only durable patterns: repeated workflows, decision policies, domain rules, tool usage, or output conventions.
- Decide whether the pattern belongs in an existing skill or warrants a new skill folder.
- Prefer updating an existing skill when the new rule extends the same domain; create a new skill only when the trigger and workflow are distinct.
- Keep each skill in a folder named with lowercase hyphen-case and store the main instructions in `SKILL.md`.
- Write frontmatter with only `name` and `description`; make the description explicit about what the skill does and when it should trigger.
- Keep instructions concise and imperative. Move only reusable guidance into the skill; leave one-off task details out.
- Trim token-heavy wording when updating skills: avoid repeated framing, long examples, and duplicate rules already covered elsewhere.
- Maintain `agents/openai.yaml` so it matches the skill's purpose with `display_name`, `short_description`, and a default prompt that explicitly references `$skill-name`.
- When a new request changes how a skill should behave, update the skill in the same task instead of postponing the maintenance.
