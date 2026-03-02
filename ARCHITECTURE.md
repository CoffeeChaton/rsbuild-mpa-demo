# 系統架構與自動化原理

## 1. 自動化 Entry 掃描機制
系統在 `rsbuild.config.ts` 中透過 `getEntries` 函數動態掃描 `src/pages/` 目錄：
* **根路徑映射**: `src/pages/index` 被映射為空字串 Entry，產出為 `/index.html`。
* **物理路徑映射**: 其他資料夾（如 `products`）產出為 `/products/index.html`。
* **後處理**: 透過自定義插件 `pluginFixPath` 在建置後修正 `404.html` 的物理位置。



## 2. GitHub Pages 路徑適配原理
為了解決非根目錄託管問題（`https://user.github.io/repo-name/`）：
* **資產前綴 (Asset Prefix)**: 
  - 自動從 `package.json` 讀取 `name`。
  - 生產環境下資源路徑會自動變為 `/repo-name/static/...`。
* **環境變數注入**: 
  - 透過 `source.define` 將 `process.env.ASSET_PREFIX` 注入前端。
  - `Navbar` 與 `React Router` 會讀取此變數來動態計算連結與 `basename`。

## 3. MPA + SPA 混合路由策略
本架構結合了多頁面應用的 SEO 優勢與單頁面應用的流暢體驗：
* **跨頁導航 (MPA)**: 當導航目標屬於不同 Entry 時，使用 `<a>` 標籤觸發物理跳轉，以更新每個頁面獨立的 SEO Meta 標籤。
* **頁內導航 (SPA)**: 在同一個 Entry 內部（如產品列表到詳情），利用 React Router 7 的 `Link` 實現無刷新跳轉。

## 4. 單一事實來源 (SSOT)
`src/common/config/pages.ts` 為全專案的配置核心：
* **建置期**: Rsbuild 讀取它來產生正確的 HTML `<title>` 與 `<meta name="description">`。
* **執行期**: `Navbar` 組件讀取它來動態渲染導航選單與處理隱藏屬性。



## 5. 中間層 (Bootstrap Layer)
`src/common/middleware/init.tsx` 負責處理：
* **環境識別**: 自動偵測是否有預渲染內容（Hydration vs Rendering）。
* **全域樣式**: 統一注入 Tailwind CSS。
* **錯誤邊界**: 提供統一的啟動錯誤捕捉邏輯。
