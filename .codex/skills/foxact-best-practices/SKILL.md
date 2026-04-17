---
name: foxact-best-practices
description: Apply project conventions for `foxact` hooks. Use when implementing clipboard flows, local storage persistence, shared persisted state, retimer-based debounce logic, or hydration-safe hook usage in this codebase.
---

# Foxact Best Practices

- Prefer `useClipboard` over direct `navigator.clipboard` access for copy actions and keep the timeout at `2000` unless the UI needs a different feedback window.
- Use `useLocalStorage` for component-local persistence and `createLocalStorageState` for shared persistent state across components.
- Place shared local-storage state modules under `src/common/state/` so other components can consume the same source of truth.
- Use `useRetimer` for resettable delayed actions such as autosave or dismissible feedback.
- Keep hydration safe: storage-backed hooks must render with deterministic initial values before client-only state hydrates.
