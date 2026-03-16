# GEMINI.md - Project Context & Strict Rules

## 1. Technical Stack

- **Framework**: React 19 (`hydrateRoot`) + Rsbuild.
- **Routing**: `react-router-dom` v7 (Hybrid MPA/SPA).
- **UI & Styling**: Radix UI Themes, Tailwind CSS v4.
- **Data**: `swr` for state management/fetching.

## 2. Mandatory Coding Rules (Strict)

- **Exports**: **Named Exports ONLY**. NEVER use `export default` (except in `rsbuild.config.ts`).
- **Type Safety**:
  - **NO `any`**. Use `unknown` + Type Guards + schema.
  - **Naming**: Types start with **`T`** (e.g., `TRowStatus`), Interfaces start with **`I`** (e.g., `IItem`).
  - **Components**: Use **`React.FC`** with **`I[ComponentName]Props`** interface naming convention.
- **Patterns**: Prefer `Object.hasOwn()` over `hasOwnProperty`.
- **Logic**: All page entries must bootstrap via `src/pages/index/main.tsx`.

## 3. Directory Structure

- `src/pages/`: Directory-based routing logic (each folder is a virtual route).
- `src/common/`: Shared configuration, router logic, and reusable components.
- `scripts/`: Build-time utilities (SSG, metadata injection).
- `public/`: Static assets (images, JSON data).

## 4. Performance Standards

- **Heavy Tables**: Large lists MUST use `React.memo` for row items.
- **Optimization**: Use `useMemo` and `useCallback` to maintain reference stability for props passed to memoized components.

## 5. Adding a New Page

1. View: `src/pages/[route]/[ViewName]/index.tsx`.
2. Map: Register in `src/common/router/view-map.ts`.
3. SSG: Add metadata to `PAGE_MAP` in `src/common/config/pages.ts`.
