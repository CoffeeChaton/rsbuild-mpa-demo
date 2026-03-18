# SKILL: Rsbuild MPA Architect (Project Specific)

---
name: static-assets-rsbuild
description: Rules for handling static assets in Rsbuild projects

rules:
  - id: public-url-only
    description: Public folder assets must be accessed via absolute URL
    do:
      - use absolute path like "/logo.png"
    dont:
      - use relative path like "../public/logo.png"

  - id: no-import-public
    description: Do not import files from public directory
    dont:
      - import from "../public/*"

  - id: use-src-assets
    description: Importable assets must be placed in src/assets
    do:
      - import from "./assets/*"

  - id: build-conflict
    description: Build output overrides public files on conflict
    notes:
      - public files are copied to dist
      - conflicting filenames will be overwritten by build output

summary:
  public: "URL only"
  src_assets: "import only"
---

# 描述: 專門管理此專案的 Multi-Page Application (MPA) 結構。

## 專案特定流程：新增頁面

1. **目錄建立**: 於 `src/pages/[route]/` 建立 `index.tsx`。
2. **註冊 View**: 將新組件匯入至 `src/common/router/view-map.ts`。
3. **配置 Metadata**: 於 `src/common/config/pages.ts` 的 `PAGE_MAP` 中註冊頁面標題與 Navbar 標籤。
4. **入口一致性**: 確保所有物理 Entry 點最終都經由 `src/main.tsx`。
