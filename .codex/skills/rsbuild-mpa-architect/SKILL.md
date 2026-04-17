---
name: rsbuild-mpa-architect
description: Maintain the Rsbuild multi-page architecture in this repository. Use when adding pages, changing entry wiring, managing route metadata, or deciding how static assets should live in `public` versus `src/assets`.
---

# Rsbuild MPA Architect

- Access files in `public/` by absolute URL such as `/logo.png`; do not import them into source files.
- Place importable assets under `src/assets/` instead of `public/`.
- Remember that build outputs can overwrite copied `public/` files with the same final path.
- When adding a new page, create `src/pages/[route]/index.tsx`.
- Register the page in `src/common/router/view-map.ts`.
- Add page metadata and navbar information in `src/common/config/pages.ts`.
- Keep physical entry points aligned through `src/main.tsx`.
