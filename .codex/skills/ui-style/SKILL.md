---
name: ui-style
description: Follow the UI styling rules for Radix UI Themes and Tailwind in this project. Use when building or restyling components so layout utilities stay in Tailwind and component styling stays in Radix tokens.
---

# UI Style

- Prefer `@radix-ui/themes` components over raw HTML elements when an equivalent component exists.
- Use Tailwind for layout, spacing, sizing, and utility composition.
- Do not recreate Radix component visuals with custom utility classes when theme props already cover the need.
- Avoid hardcoded component colors; prefer Radix theme props and design tokens.
- Treat the styling split as: UI primitives in Radix, layout in Tailwind, visual tokens in Radix.
- Prefer `className` + `cn()` over ad-hoc `style` props; keep inline style objects only for values that cannot be expressed with Tailwind or Radix props.
- Check responsive behavior for these widths when layout, header, table, or toolbar changes: `1920x1080` at `100%`, `50%`, `30%`, and iPhone/mobile widths.
- When width is tight, prefer wrap, horizontal scroll, truncation, or popovers instead of letting nav bars and toolbars crush adjacent controls.
