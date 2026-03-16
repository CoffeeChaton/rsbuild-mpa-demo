# SKILL: Arknights Data Wizard (Project Specific)

# 描述: 處理明日方舟遊戲數據編譯、校驗與計算邏輯。

## 數據處理規範

- **Source**: 數據來源自 `scripts/input/` 的原始 JSON。
- **Compilation**: 執行 `pnpm scripts:compile-materials` 生成前端可用的 JSON。
- **Validation**: 使用 `shared/schemas/` 中的 Valibot schema 進行數據結構校驗。
- **Precision**: 練度計算（Leveling Calculation）需嚴格遵守 `src/pages/game2/core/` 中的數學公式。

## 常用工具

- `valibot`: 用於類型安全的數據驗證。
- `localStorage`: 數據持久化需考慮多個 ConfigId 的隔離。
