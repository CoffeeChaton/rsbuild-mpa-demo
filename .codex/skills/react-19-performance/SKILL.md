---
name: react-19-performance
description: Optimize React 19 performance for this project's heavy UI flows. Use when working on large tables, row rendering, context design, deferred updates, or hydration-sensitive components.
---

# React 19 Performance

- Memoize expensive row-like components with `React.memo` when rerender volume is high.
- Keep props reference-stable for memoized children when instability would defeat render savings.
- Avoid reading browser-only APIs during initial render; move that work into effects when hydration safety matters.
- Split oversized contexts so frequently changing values do not force unrelated subtrees to rerender.
- Use `useDeferredValue` for non-urgent updates in high-frequency inputs and filtering flows.
