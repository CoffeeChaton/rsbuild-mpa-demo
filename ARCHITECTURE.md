# 系統架構與自動化原理

## 1. 自動化 Entry 掃描機制
系統在 `rsbuild.config.ts` 中透過 `getEntries` 函數動態掃描 `src/pages/` 目錄：
* **超級入口 (Super Entry)**: 所有目錄（如 `index`, `products`）均指向同一個核心入口 `src/pages/index/main.tsx`。
* **物理路徑映射**: 儘管邏輯統一，Rsbuild 仍會為每個資料夾產出對應的 `index.html`（如 `/products/index.html`），以確保物理路徑的存在。
* **路徑修正**: 透過自定義插件 `pluginFixPath` 在建置後自動將 `404/index.html` 提升至根目錄 `404.html`，以符合 GitHub Pages 規範。

## 2. GitHub Pages 路徑適配原理
為了解決非根目錄託管問題 (`https://user.github.io/repo-name/`)：
* **資產前綴 (Asset Prefix)**: 從 `package.json` 動態讀取 `name`，確保生產環境資源路徑正確指向 `/${repoName}/`。
* **環境變數同步**: 透過 `source.define` 將 `process.env.ASSET_PREFIX` 注入前端，使 React Router 的 `basename` 與 Rsbuild 的路徑設定達成單一事實來源 (SSOT)。

## 3. Hybrid MPA/SPA 路由策略
本架構結合了多頁面應用的 SEO 優勢與單頁面應用的流暢體驗：
* **Initial Load (MPA)**: 使用者直接輸入 URL 時，由物理 HTML 提供首屏內容。
* **Client Navigation (SPA)**: 進入頁面後，透過 `react-router` 接管所有跳轉，達成無刷新、無閃爍的 CSR 體驗。
* **Code Splitting**: 使用 `React.lazy` 與 `Suspense` 進行按需載入。訪問首頁時，瀏覽器不會下載產品或其他頁面的 JS 資源。

## 4. 靜態優化與元數據同步
* **Post-build SSG**: `ssg.ts` 腳本在建置後掃描 `PAGE_MAP`，將正確的 `<title>` 與 `<meta>` 標籤直接寫入實體 HTML 檔案，優化 SEO 並解決 CSR 標題閃爍。
* **MetaUpdater**: 在客戶端導航時，透過 React Hook 監聽路由變化，即時同步瀏覽器標籤標題。

## 5. 零成本環境模擬 (Zero-cost Emulation)
* **O(1) In-place Restructuring**: `post-build-live.ts` 利用檔案系統的 `rename` 原子操作，在不增加磁碟寫入負擔的情況下，於 `dist` 目錄內模擬物理子目錄結構。
* **SPA Fallback**: 自動生成 `serve.json` 覆寫規則，確保在本地模擬環境下重新整理頁面不會發生 404。
