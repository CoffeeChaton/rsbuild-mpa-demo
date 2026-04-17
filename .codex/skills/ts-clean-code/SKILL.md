---
name: ts-clean-code
description: Apply the project's TypeScript style guide. Use when writing or reviewing TypeScript in this repo and you need naming conventions, immutability rules, error-handling guidance, or runtime validation preferences.
---

# TypeScript Clean Code

- Prefer explicit types where hidden inference would reduce readability or safety.
- Favor immutable data with `readonly` properties and `ReadonlyArray` when mutation is not required.
- Avoid partial functions and `any`; handle unknown input shapes explicitly.
- Use `IName` for interfaces, `TName` for types, and `EName` for enums when introducing new symbols.
- Prefer composition over inheritance.
- Catch errors as `unknown` and narrow them with guards before using their fields.
- Prefer `valibot` for runtime validation and `vitest` for unit tests when adding supporting tooling.
