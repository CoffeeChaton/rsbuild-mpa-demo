# 📄 系統架構與自動化原理 (Technical Whitepaper)

## 一、 自動化 Entry 與路徑策略

1. **動態 Entry 掃描**: 透過 `rsbuild.config.ts` 中的 `getEntries` 函數動態掃描 `src/pages/`。所有目錄均指向核心入口 `src/pages/index/main.tsx`，達成「邏輯統一、物理獨立」。
2. **GitHub Pages 適配 (SSOT)**:

   - **資產前綴**: 從 `package.json` 自動讀取 `name` 作為生產環境 `ASSET_PREFIX`。
   - **路徑注入**: 透過 `source.define` 將前綴注入前端，確保 React Router 的 `basename` 與 Rsbuild 靜態資源路徑一致。
3. **pluginFixPath 插件**: 建置後自動將 `404/index.html` 提升至根目錄 `404.html`，以符合 GitHub Pages 的 SPA Fallback 規範。

## 二、 建置穩定性與安全性 (Infrastructure)

5. **隱藏檔案防禦**: 嚴禁產出以 `.` 開頭的資產檔案（如 `.hash.js`），避免部分靜態伺服器因攔截隱藏檔而觸發 404 與 MIME 類型錯誤。
6. **跨平台清理策略**: 採用 `rimraf` 實作冪等 (Idempotent) 的清理邏輯，解決 Windows 環境下頻發的 `EBUSY` 檔案鎖定問題。
7. **現代化屬性校驗**: 統一使用 `Object.hasOwn()` 驗證動態索引存取，杜絕透過 `__proto__` 進行的原型鏈污染攻擊。

## 三、 強型別與環境隔離 (TypeScript)

8. **多維型別隔離**:

   - **App 層**: 注入 `DOM` 庫，專注於 React 渲染。
   - **Node 層**: 僅限 `ESNext` 與 `node` 類型，嚴禁在腳本中引用 DOM 物件。
9. **專案參照架構 (References)**: 根目錄 `tsconfig.json` 作為總控入口，開啟 `composite: true` 支援增量檢查。
10. **單一入口監控**: 採用 `tsc -b -w` (-b 代表 build mode) 同時監控瀏覽器與 Node 環境，極大化縮短診斷延遲。
11. **命名規範 (LSP-less Optimization)**:

    - 自定義 **Type** 必須以 `T` 開頭 (例如: `TPageKey`)。
    - 自定義 **Interface** 必須以 `I` 開頭 (例如: `IPageInfo`)。
    - 嚴禁使用 `any`，必須使用 `unknown`。
    - 嚴禁使用 `export default function` (特殊配置文件除外)。

## 四、 混合路由與 SEO 策略 (Hybrid MPA/SPA)

12. **Initial Load (MPA)**: 使用者直接輸入 URL 時，由物理 HTML 提供首屏內容，解決 SEO 問題。
13. **Client Navigation (SPA)**: 進入後由 `react-router` 接管跳轉，達成無刷新體驗。
14. **雙重元數據同步**:

    - **靜態 (SSG)**: `ssg.ts` 腳本建置後將 `PAGE_MAP` 資訊直接寫入 HTML，防止標題閃爍。
    - **動態 (Hook)**: `MetaUpdater` 在客戶端導航時即時同步瀏覽器 Tab 標題。

## 36. 靜態斷言與 Never 守衛 (Static Assertions & Never Guard)

- **非 Never 校驗**: 使用 `TIsNotNever<T>` 進行類型檢查。利用 `[T] extends [never]` 語法規避 TypeScript 對 `never` 類型的自動分發行為。
- **編譯期中斷**: 關鍵配置（如地圖圖資、用戶偏好）在推導後必須通過 `TAssertEqual` 與 `TIsNotNever` 的雙重驗證，確保執行期 Schema 與靜態 Interface 絕對同步。
