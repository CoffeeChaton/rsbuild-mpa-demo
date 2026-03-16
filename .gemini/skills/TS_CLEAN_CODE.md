# SKILL: TypeScript Clean Code (Public/General)

# 描述: 通用的 TypeScript 業界標準開發規範，適用於大多數 React + TS 專案。

## 核心準則

- **Explicit over Implicit**: 優先使用顯式定義，減少編譯器的自動推斷。
- **Immutability**: 優先使用 `readonly` 屬性與 `ReadonlyArray`，避免副作用。
- **Total Functions**: 確保函數在所有可能的輸入下都有定義（避免 `any`）。

## 代碼風格規範

- **Naming**:
  - Interface: `I[Name]` (例如: `IUser`)
  - Type: `T[Name]` (例如: `TStatus`)
  - Enum: `E[Name]` (例如: `ERole`)
- **Composition**: 優先使用組合物（Composition）而非繼承。
- **Errors**: 使用 `unknown` 捕捉錯誤並配合類型守衛，而非假設錯誤類型。

## 推薦工具鏈

- `eslint-plugin-typescript`
- `valibot` 進行運行時校驗。
- `vitest` 進行單元測試。
