# GEMINI.md - Project Context & Strict Rules

## 1. Technical Stack

- **Framework**: React 19 (`hydrateRoot`) + Rsbuild.
- **Routing**: `react-router-dom` v7 (Hybrid MPA/SPA).
- **UI & Styling**: Radix UI Themes, Tailwind CSS v4.
- **Data & State**: `swr` (用於遠端 Fetching), `foxact` (UI Hooks).

## 2. Mandatory Coding Rules (Strict)

- **Exports**: **Named Exports ONLY**. NEVER use `export default` (except in `rsbuild.config.ts`).
- **External Libraries**:
  - **Clipboard**: 必須使用 `foxact/use-clipboard`。所有剪貼行為必須提供 UI 反饋（如顯示「已複製」狀態）。
  - **Storage**: 優先使用 `foxact` 的 `useLocalStorage` 或 `createLocalStorageState` 處理持久化。
- **Type Safety**:
  - **NO `any`**. Use `unknown` + Type Guards + schema.
  - **Naming**: Types start with **`T`** (e.g., `TRowStatus`), Interfaces start with **`I`** (e.g., `IItem`).
  - **Components**: Use **`React.FC`** with **`I[ComponentName]Props`** interface naming convention.
- **Patterns**: Prefer `Object.hasOwn()` over `hasOwnProperty`.
- **Logic**: All page entries must bootstrap via `src/pages/index/main.tsx`.

## 3. Data & State Management Patterns

- **Context Design**: 嚴禁使用巨型 Context。必須將數據拆分為「子 Context」（例如 `ItemsContext`, `InventoryContext`），以精確控制渲染範圍。
- **Storage Namespacing**: 存檔 Key 必須遵循 `${STORAGE_KEY}_data_${configId}` 格式，確保多存檔隔離。

## 4. Performance Standards (Heavy Tables)

- **Memoization**: 大規模數據行（Rows）必須使用 `React.memo`。
- **Custom Comparison**: 若 Row 組件接收複雜 Object，必須實作自定義比較函數（如 `areRowValuesEqual`）。
- **Reference Stability**: 所有傳遞給 memoized 組件的 callback 必須使用 `useCallback`；計算結果使用 `useMemo`。

## 5. Adding a New Page

1. **View**: `src/pages/[route]/[ViewName].tsx`.
2. **Provider**: 若有複雜狀態，需建立 `[Name]Context.tsx`。
3. **Map**: 於 `src/common/router/view-map.ts` 註冊組件。
4. **SSG**: 於 `src/common/config/pages.ts` 的 `PAGE_MAP` 中新增 Metadata。

## 6. RWD Standards

- 必須測試以下斷點的佈局表現：
  - Desktop (1920x1080)
  - Split View (Desktop / 2)
  - Mobile (iPhone SE)
- 優先使用 Radix UI 的響應式 Props (例如 `columns={{ initial: "1", lg: "2" }}`).
