---
name: ts-clean-code
description: Apply the project's TypeScript style guide. Use when writing or reviewing TypeScript in this repo and you need naming conventions, immutability rules, error-handling guidance, or runtime validation preferences.
---

# TypeScript Clean Code

- Prefer explicit types where hidden inference would reduce readability or safety.
- Favor immutable data with `readonly` properties and `ReadonlyArray` when mutation is not required.
- Avoid partial functions and `any`; handle unknown input shapes explicitly.
- Prefer top-down function ordering in a file: define helpers before the call sites that use them.
- Do not use the `in` operator for key checks.
- Use `IName` for interfaces, `TName` for types, and `EName` for enums when introducing new symbols.
- Prefer composition over inheritance.
- Catch errors as `unknown` and narrow them with guards before using their fields.
- Do not use general `as` type assertions; prefer narrowing, helper functions, or typed intermediate values. Treat `as const` as the only routine exception.
- Unknown external data should go through `valibot` before the rest of the logic uses it; do not paper over unknown shapes with reflection-style property reads.
- When you need dynamic membership lookups, prefer explicit `Map` / `Set` structures and their `get` / `has` APIs over ad-hoc reflection patterns.
- Prefer `valibot` for runtime validation and `vitest` for unit tests when adding supporting tooling.
