# Arsenal Calculator

Arknights operator upgrade cost calculator.

Features:

• TSV clipboard import
• cumulative LMD / EXP calculation
• reorderable upgrade plan
• inventory safety check

Architecture:

```
layout → features → components → hooks → core → types
```

以下是目前的數據流圖與拆解分析：

1. 核心數據架構 (ArsenalContext)

ArsenalProvider 提供了四個拆分後的子 Context，這是非常好的實作（符合 GEMINI.md 規範），能有效減少不必要的渲染。

┌──────────────────┬────────────────────────────┬─────────────────────────┐
│ Context 類別 │ 包含內容 │ 數據流向角色 │
├──────────────────┼────────────────────────────┼─────────────────────────┤
│ ItemsContext │ items, setItems │ 核心規劃數據 (持久化) │
│ InventoryContext │ inventory, setInventory │ 玩家資產數據 (持久化) │
│ RowsContext │ rows (計算後的結果) │ 衍生計算數據 (即時運算) │
│ ActionsContext │ handleImport, handleExport │ 全域操作行為 │
└──────────────────┴────────────────────────────┴─────────────────────────┘

---

2. 各組件的依賴清單

LeftSidebar (透過 BasicInfoPanel)

- 角色：數據輸入源 (Source)
- 使用了什麼：
  - useArsenalInventory: 讀取並修改 inventory（金錢、經驗書、日產能）。
- 行為：修改 inventory 會觸發全域重新計算 rows。

TableArea

- 角色：核心編輯器 & 中間計算顯示 (Processor)
- 使用了什麼：
  - useArsenalItems: 讀取並修改 items 列表（新增/刪除角色、調整目標等級）。
  - useArsenalRows: 顯示每行計算後的資源缺口。
  - useArsenalActions: 觸發 TSV 導入/導出。
- 行為：這是邏輯最重的地方，負責推動 items 的持久化更新。

BottomDiagnosticPanel (透過 DiagnosticPanel)

- 角色：數據匯總與終點 (Sink)
- 使用了什麼：
  - useArsenalRows: 讀取所有行的總需求。
  - useArsenalInventory: 讀取當前庫存與日產能。
- 行為：透過 useDiagnostics 計算出「還差多少錢/書」以及「還需多少天」。

---

3. 可以拆掉或簡化的部分（優化建議）

A. 減少 RowsContext 的全量依賴
目前 TableArea 與 DiagnosticPanel 都依賴 rows。

- 現狀：只要任何一行等級變了，rows 全陣列引用改變，導致 TableArea 內所有 TableRowItem 重新 render（即便有 memo 也會進行 props check）。
- 建議：將 rows 的計算邏輯進一步下放到 「單行計算組件」 或使用 「選擇性 Selector」。

B. 移除 BasicInfoPanel 對全量 inventory 的修改依賴

- 現狀：BasicInfoPanel 直接透過 setInventory 修改整個物件。
- 建議：可以在 Context 層提供更細粒度的 actions（如 updateMoney(val), updateProduction(key, val)），避免組件層需要知道 inventory 的完整結構。

C. 拆分 useArsenalRowsRaw 中的副作用

- 現狀：useArsenalRowsRaw 內部做了過多事情。
- 建議：
  - 將 「資源計算 (Level/Module Cost)」 與 「狀態診斷 (Safe/Danger Status)」 拆開。
  - rows 只負責資源加總。
  - status (變紅邊框) 可以在 TableRowItem 內部根據當前 inventory 動態判斷，不需要預存在 rows 裡。

D. 持久化邏輯優化

- 目前 useArsenalStorage 同時負責 items 和 inventory 的讀寫。
- 建議：如果之後系統變大，可以將「玩家設定 (Inventory)」與「角色規劃 (Items)」拆成兩個獨立的儲存 Hook，降低單一組件在讀取緩存時的開銷。

總結優化方向：

1. TableArea：專注於 items 的增刪改，不應過度關心全域匯總。
2. BottomDiagnosticPanel：它才是真正的「消費者」，應確保它獲取的匯總數據是經過穩定緩存的。
3. 計算邏輯：將 calcArsenalRows 裡面的 moneyStatus 等 UI 狀態邏輯抽離，讓數據更純粹。
