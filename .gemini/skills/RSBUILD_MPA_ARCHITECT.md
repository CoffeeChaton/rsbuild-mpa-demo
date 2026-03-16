# SKILL: Rsbuild MPA Architect (Project Specific)

# 描述: 專門管理此專案的 Multi-Page Application (MPA) 結構。

## 專案特定流程：新增頁面

1. **目錄建立**: 於 `src/pages/[route]/` 建立 `index.tsx`。
2. **註冊 View**: 將新組件匯入至 `src/common/router/view-map.ts`。
3. **配置 Metadata**: 於 `src/common/config/pages.ts` 的 `PAGE_MAP` 中註冊頁面標題與 Navbar 標籤。
4. **入口一致性**: 確保所有物理 Entry 點最終都經由 `src/pages/index/main.tsx`。

## Rsbuild 配置規範

- 靜態資源（assets）應放置於 `public/` 並透過 `assetPrefix` 引用。
- SSG 注入時需檢查 `pluginSSG` 的 metadata 注入是否完整。
