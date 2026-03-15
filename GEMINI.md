# GEMINI.md - Project Instructional Context

## 1. Project Overview

This project is an **Rsbuild-powered React 19** application, specifically designed as a **Hybrid MPA/SPA** (Multi-Page Application / Single Page Application). It serves as a platform for various "Arknights" (明日方舟) game-related planning tools and GIS experiments.

### Key Technologies:

- **Build System**: [Rsbuild](https://rsbuild.dev/) (v1.7+)
- **Frontend Library**: React 19 (using `hydrateRoot` for SSG compatibility)
- **Routing**: `react-router-dom` v7+ (configured with `basename`)
- **State Management / Data Fetching**: `swr`
- **Styling**: Tailwind CSS v4, Lucide React, Shadcn UI, Radix UI, @radix-ui/themes
- **Language**: TypeScript (with composite builds and strict rules)
- **Formatting/Linting**: `dprint`, `eslint`

---

## 2. Architecture & Design Principles

### Hybrid MPA/SPA Strategy

- **Logical Entry**: All pages point to a unified entry at `src/pages/index/main.tsx`.
- **Physical Segregation**: Rsbuild `getEntries` dynamically scans `src/pages/` and generates nested `index.html` files for each route (e.g., `dist/game3/index.html`).
- **SEO/SSG**: A custom `pluginSSG` injects metadata (titles, descriptions) from `src/common/config/pages.ts` into HTML templates during the build.
- **Client-side Navigation**: Once loaded, `react-router-dom` handles transitions without full page reloads.

### Type System & Safety

- **Multi-layered tsconfig**: Separate configurations for App (DOM) and Node environments (scripts).
- **Composite Builds**: Uses `tsc -b` for incremental, strict type checking across all environments.
- **Never Guards**: Uses `TIsNotNever<T>` and `TAssertEqual` for compile-time validation of critical configurations.

---

## 3. Building and Running

| Command          | Description                                                         |
| :--------------- | :------------------------------------------------------------------ |
| `pnpm dev`       | Start dev server at `http://localhost:3055`                         |
| `pnpm build`     | Production build (includes SSG & 404 fixing)                        |
| `pnpm preview`   | Preview build with production-like base path (`/rsbuild-mpa-demo/`) |
| `pnpm typecheck` | Run full project type check via `tsgo`                              |
| `pnpm lint`      | Run ESLint with timing and caching                                  |
| `pnpm format`    | Format all files using `dprint`                                     |
| `pnpm test`      | Run tests with Vitest                                               |

---

## 4. Development Conventions

### Code Style & Patterns

- **Named Exports Only**: NEVER use `export default` (except for specific config files like `rsbuild.config.ts`).
- **Strict Typing**:
  - NO `any`. Use `unknown` and type guards.
  - Types must start with `T` (e.g., `TPageKey`).
  - Interfaces must start with `I` (e.g., `IPageInfo`).
- **Bootstrapping**: All entries must go through the `bootstrap` function in `main.tsx`.
- **Modern JS**: Prefer `Object.hasOwn()` over `hasOwnProperty`.

### File Organization

- `src/pages/`: Directory-based routing logic (each folder is a virtual route).
- `src/common/`: Shared configuration, router logic, and reusable components.
- `scripts/`: Build-time utilities (SSG, metadata injection).
- `public/`: Static assets (images, JSON data).

### Adding a New Page

1. Create a View in `src/pages/[route]/[ViewName]/index.tsx`.
2. Register the component in `src/common/router/view-map.ts`.
3. Add metadata to `PAGE_MAP` in `src/common/config/pages.ts`.
4. Verify via `pnpm build`.
