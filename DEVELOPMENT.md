# 開發規範與操作手冊 (2026-03)

## 🚀 快速開始
* `pnpm dev`: 啟動開發環境 (http://localhost:3000)
* `pnpm build`: 執行生產環境建置 (輸出至 /dist)
* `pnpm preview`: 本地預覽生產環境產出（自動模擬 GitHub Pages 路徑）

## 🛠️ 新增頁面標準流程
1. **建立資料夾**: 在 `src/pages/` 下建立新資料夾（如 `about`）。
2. **入口文件**: 建立 `main.tsx` 並呼叫 `bootstrap(App)`。
3. **頁面邏輯**: 建立 `App.tsx`。若需內部路由，必須設定 `basename: getBasename('about')`。
4. **註冊 Metadata**: 在 `src/common/config/pages.ts` 的 `PAGE_MAP` 增加該頁面的 `title`, `description` 與 `label`。

## ⚠️ 代碼風格約束 (強制)
* **具名匯出**: 永遠禁止使用 `export default function`。請使用 `export const Component = ...`。
* **類型安全**: 嚴格禁止使用 `any`。請使用 `unknown` 並配合 `instanceof` 或類型守衛進行檢查。
* **中間層**: 所有頁面入口必須經由 `src/common/middleware/init.tsx` 進行初始化。

## ❓ 常見問題
* **Q: 為什麼本地 Live Server 預覽會白屏？**
  * A: 因為生產環境建置會帶有 `assetPrefix` (repo-name)。請統一使用 `pnpm preview` 進行本地測試。
* **Q: 如何隱藏導航列中的頁面？**
  * A: 在 `PAGE_MAP` 中將該頁面的 `hidden` 屬性設為 `true`。
