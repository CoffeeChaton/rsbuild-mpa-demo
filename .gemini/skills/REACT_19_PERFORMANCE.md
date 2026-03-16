# SKILL: React 19 Performance Optimizer (Project Specific)

# 描述: 針對 React 19 與本專案「重型表格」設計的效能優化。

## 效能準則

- **Memoization**: 大規模數據行（Rows）必須使用 `React.memo` 封裝，並進行自定義比較。
- **Reference Stability**: 傳遞給 memoized 組件的 props 必須使用 `useCallback` 或 `useMemo` 維持引用穩定性。
- **Hydration Safety**: 由於使用 `hydrateRoot`，需避免在初次渲染時使用僅限客戶端的 API（如 `window`），若必須使用應在 `useEffect` 中。

## Context 拆分策略

- 避免使用「巨型 Context」。應將 `items`、`inventory` 與 `rows` 拆分為獨立的 Provider，以減少不必要的重繪。
- 頻繁變更的 UI（如 Input）應配合 `useDeferredValue` 處理非緊急更新。
