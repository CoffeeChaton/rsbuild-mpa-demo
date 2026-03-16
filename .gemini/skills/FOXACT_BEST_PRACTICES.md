# SKILL: Foxact Hooks Best Practices

# 描述: 專案中 foxact 常用 Hooks 的使用規範與最佳實踐。

## 1. 剪貼簿 (useClipboard)

當需要將數據匯出為 TSV 或複製設定字串時，優先使用 `useClipboard` 而非手動操作 `navigator.clipboard`。

```tsx
import { useClipboard } from "foxact/use-clipboard";

// 規範：設定 timeout 為 2000ms 以提供足夠的 UI 反饋時間
const { copy, copied, error } = useClipboard({ timeout: 2000 });

// 建議用法：搭配按鈕顯示 "Copied!" 狀態
<button onClick={() => copy(dataString)}>
	{copied ? "已複製" : "複製到剪貼簿"}
</button>;
```

## 2. 本地持久化 (useLocalStorage / createLocalStorageState)

專案內若僅是「組件層級」的輕量持久化，使用 `useLocalStorage`；若需「跨組件/全域」同步狀態，使用 `createLocalStorageState`。

### 跨組件同步 (推薦用於 UI 狀態，如 Sidebar, Theme)

在 `src/common/state/` 下定義持久化狀態：

```tsx
// src/common/state/sidebar.ts
import { createLocalStorageState } from "foxact/create-local-storage-state";

// 定義一次，到處使用 (Hook 會自動同步不同組件間的狀態)
export const [useSidebarActive, useSidebarActiveValue] = createLocalStorageState("sidebar-active", true);
```

## 3. 定時器防抖 (useRetimer)

用於處理「最後一次觸發後延遲執行」的場景，例如自動保存、提示框消失。

```tsx
import { useRetimer } from "foxact/use-retimer";

const retimer = useRetimer();
// 規範：當需要重置定時器時，直接調用 retimer 並傳入新的 setTimeout
const handleAutoSave = () => {
	retimer(setTimeout(() => save(), 3000));
};
```

## 4. 效能與 React 19 注意事項

- **Memoization**: `foxact` 的 Hook 大多已內建 memoized，可以直接放入 `useCallback` 的依賴陣列。
- **SSR/Hydration**: 由於專案使用 `hydrateRoot`，`useLocalStorage` 在 Hydration 階段會優先使用傳入的初始值，確保伺服器與客戶端渲染一致，避免 Hydration Mismatch。
