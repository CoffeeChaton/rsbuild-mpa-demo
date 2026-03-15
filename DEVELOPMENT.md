# 開發規範與操作手冊 (2026-03)

## 🚀 常用指令

- `pnpm dev`: 啟動開發環境 (http://localhost:3000)
- `pnpm build`: 生產環境建置 (包含 SSG 注入與 404 修正)
- `pnpm preview`: 預覽建置成果 (模擬 GitHub Pages 路徑)

## 🛠️ 新增頁面標準流程

1. **建立 View**: 在 `src/pages/` 下建立新組件（例如 `src/pages/about/AboutView.tsx`）。
2. **註冊路由**: 於 `src/pages/index/App.tsx` 使用 `lazy()` 匯入該組件並新增路徑。
3. **註冊 Metadata**: 於 `src/common/config/pages.ts` 的 `PAGE_MAP` 中定義標題、描述與 Navbar 標籤。
4. **自動驗證**: 執行 `pnpm build`，系統會自動為新頁面生成對應的實體目錄與優化後的 HTML。

## ⚠️ 代碼風格約束 (強制)

- **禁止 Export Default**: 永遠禁止使用 `export default`。請使用具名匯出，例如 `export const App = ...`。
- **禁止使用 Any**: 嚴格禁止 `any` 類型。請使用 `unknown` 並搭配類型守衛（Type Guards）或斷言。
- **中間層接入**: 所有 Entry 點必須經由 `src/common/middleware/init.tsx` 的 `bootstrap` 函數啟動，確保全域樣式與嚴格模式生效。

## 🔍 故障排除

- **Q: 點擊導航欄路徑疊加 (e.g., /products/products)？**
  - A: 確保 Navbar 使用 `Link` 且導向正確的路由路徑。本系統已透過 `basename` 自動處理子路徑偏移。
- **Q: 為什麼重新整理頁面會 404？**
  - A: 在本地測試時，請確保使用 `pnpm preview` 或 `pnpm build:live`，這兩者都配置了 `historyApiFallback` 轉發規則。
- **Q: 部署到 GitHub Pages 後白屏？**
  - A: 檢查 `package.json` 的 `name` 是否與倉庫名稱一致。系統會根據此名字自動計算 `ASSET_PREFIX`。

## 🤖 自動化部署 (CI/CD)

本專案配置了 GitHub Actions (`.github/workflows/deploy.yml`)：

- **環境**: Node.js 23 + pnpm 10。
- **流程**:
  1. 偵測 `main` 分支推送。
  2. 執行依賴快取。
  3. 執行物理建置、SSG 標題注入與 404 物理路徑修正。
  4. 自動推送至 GitHub Pages 靜態空間。

## 🔍 故障排除：EBUSY Error

**原因**: Windows 系統鎖定了 `dist` 資料夾。通常是因為終端機路徑正位在 `dist` 內部，或 `serve` 正在運行。
**解決**:

1. `cd ..` 退出 `dist` 目錄。
2. 關閉所有開啟 `dist` 檔案的程式（如 VS Code 預覽、檔案總管）。
3. 重新執行 `pnpm build`。
