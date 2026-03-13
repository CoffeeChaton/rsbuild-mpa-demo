import { useState, useEffect, type ChangeEvent } from "react";

type Item = {
  id: number;
  calculate: boolean; // 是否計算
  rarity: number; // 稀有度
  sixStar: string; // 六星名稱
  skillNote: string; // 技能備註
  from1: number; // FROM
  later: number; // 後來
  elite1: number; // 精英階級(0/1/2)
  level1: number; // 等級1-90
  elite2: number; // 精英階級(0/1/2)
  level2: number; // 等級1-90
  money: number; // 錢 (計算)
  books: number; // 書 (計算)
};

const LOCAL_STORAGE_KEY = "arsenal-calculator-data3";

// 假設計算邏輯 (示意，請依需求改)
const calculateMoneyBooks = (item: Item) => {
  // 這裡簡單用 level2-level1 計算範圍 (可根據精英階級調整)
  const count = Math.max(0, item.level2 - item.level1 + 1);
  const money = 370000 * count;
  const books = 239400 * count;
  return { money, books };
};

// 解析 TSV (新結構)
// 標題需與格式對應，缺值或錯誤跳過
function parseTSV(tsv: string): Item[] {
  const lines = tsv.trim().split("\n");
  const header = lines[0].split("\t").map((h) => h.trim());
  const items: Item[] = [];

  const mapIndex = (name: string) => header.findIndex((h) => h === name);

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split("\t");
    if (cols.length < header.length) continue;

    items.push({
      id: i,
      calculate: cols[mapIndex("是否計算")].trim() === "O",
      rarity: Number(cols[mapIndex("稀有度")]) || 5,
      sixStar: cols[mapIndex("六星")].trim(),
      skillNote: cols[mapIndex("技能備註")].trim(),
      from1: Number(cols[mapIndex("FROM")]) || 0,
      later: Number(cols[mapIndex("後來")]) || 0,
      elite1: Number(cols[mapIndex("精英階級(0/1/2 enum)")]) || 0,
      level1: Number(cols[mapIndex("等級1-90")]) || 1,
      elite2: Number(cols[mapIndex("精英階級(0/1/2 enum)1")]) || 0,
      level2: Number(cols[mapIndex("等級1-901")] || cols[mapIndex("等級1-90")]) || 1,
      money: 0,
      books: 0,
    });
  }
  return items;
}

// 將資料轉回 TSV
function serializeTSV(items: Item[]): string {
  const header = [
    "是否計算",
    "稀有度",
    "六星",
    "技能備註",
    "FROM",
    "後來",
    "精英階級(0/1/2 enum)",
    "等級1-90",
    "精英階級(0/1/2 enum)1",
    "等級1-901",
    "錢",
    "書",
  ];
  const rows = items.map((i) => [
    i.calculate ? "O" : "X",
    i.rarity.toString(),
    i.sixStar,
    i.skillNote,
    i.from1.toString(),
    i.later.toString(),
    i.elite1.toString(),
    i.level1.toString(),
    i.elite2.toString(),
    i.level2.toString(),
    i.money.toLocaleString(),
    i.books.toLocaleString(),
  ]);
  return [header.join("\t"), ...rows.map((r) => r.join("\t"))].join("\n");
}

export function ArsenalCalculator() {
  const [items, setItems] = useState<Item[]>([]);
  const [tsvInput, setTsvInput] = useState("");
  const [exportText, setExportText] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const [outputVisible, setOutputVisible] = useState(false);

  // 讀本地緩存
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      setItems(JSON.parse(raw));
    }
  }, []);

  // 計算並存localStorage
  useEffect(() => {
    const newItems = items.map((item) => {
      if (!item.calculate) return { ...item, money: 0, books: 0 };
      const { money, books } = calculateMoneyBooks(item);
      return { ...item, money, books };
    });
    setItems(newItems);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems));
  }, [items.length, JSON.stringify(items.map(i => [i.calculate, i.from1, i.level1, i.level2]))]);

  function updateField(id: number, field: keyof Item, value: any) {
    setItems((old) =>
      old.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function addRow() {
    const newId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([
      ...items,
      {
        id: newId,
        calculate: false,
        rarity: 5,
        sixStar: "",
        skillNote: "",
        from1: 0,
        later: 0,
        elite1: 0,
        level1: 1,
        elite2: 0,
        level2: 1,
        money: 0,
        books: 0,
      },
    ]);
  }
  function deleteRow(id: number) {
    setItems(items.filter((i) => i.id !== id));
  }
  function moveUp(id: number) {
    const idx = items.findIndex((i) => i.id === id);
    if (idx <= 0) return;
    const newItems = [...items];
    [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
    setItems(newItems);
  }
  function moveDown(id: number) {
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1 || idx === items.length - 1) return;
    const newItems = [...items];
    [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
    setItems(newItems);
  }

  // TSV 輸入框變更
  function handleTsvInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setTsvInput(e.target.value);
  }

  // 從貼上板讀取文字並顯示到輸入框
  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      setTsvInput(text);
    } catch {
      alert("讀取剪貼簿失敗，請手動貼上。");
    }
  }

  function importFromTsv() {
    try {
      const imported = parseTSV(tsvInput);
      setItems(imported);
      setTsvInput("");
    } catch (e) {
      alert("TSV 解析失敗，請確認格式");
    }
  }

  // 輸出 TSV
  function exportToTsv() {
    setExportText(serializeTSV(items));
  }

  // 一鍵複製輸出
  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(exportText);
      alert("複製成功！");
    } catch {
      alert("複製失敗，請手動複製。");
    }
  }

  return (
    <div className="p-4 max-w-7xl mx-auto font-sans text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Arsenal Calculator</h1>

      {/* 輸入區摺疊 */}
      <button
        className="mb-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        onClick={() => setInputVisible(!inputVisible)}
      >
        {inputVisible ? "隱藏輸入區" : "顯示輸入區（貼上 TSV）"}
      </button>
      {inputVisible && (
        <div className="mb-4">
          <textarea
            rows={8}
            value={tsvInput}
            onChange={handleTsvInputChange}
            className="w-full p-2 border rounded resize-y font-mono"
            placeholder="請貼上 TSV 原始資料"
          />
          <div className="flex space-x-2 mt-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={pasteFromClipboard}
            >
              一鍵從剪貼簿讀取
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={importFromTsv}
              disabled={!tsvInput.trim()}
            >
              匯入資料
            </button>
          </div>
        </div>
      )}

      {/* 表格 */}
      <table className="w-full border-collapse border border-gray-300 mb-4 text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-1">計算</th>
            <th className="border border-gray-300 p-1">稀有度</th>
            <th className="border border-gray-300 p-1">六星</th>
            <th className="border border-gray-300 p-1">技能備註</th>
            <th className="border border-gray-300 p-1">模組(初值)</th>
            <th className="border border-gray-300 p-1">模組(目標)</th>
            <th className="border border-gray-300 p-1">精英階級(0/1/2)</th>
            <th className="border border-gray-300 p-1">等級1-90</th>
            <th className="border border-gray-300 p-1">精英階級(0/1/2)1</th>
            <th className="border border-gray-300 p-1">等級1-901</th>
            <th className="border border-gray-300 p-1">錢</th>
            <th className="border border-gray-300 p-1">書</th>
            <th className="border border-gray-300 p-1">操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map(
            (
              {
                id,
                calculate,
                rarity,
                sixStar,
                skillNote,
                from1,
                later,
                elite1,
                level1,
                elite2,
                level2,
                money,
                books,
              },
              idx
            ) => (
              <tr key={id}>
                <td className="border border-gray-300 p-1">
                  <input
                    type="checkbox"
                    checked={calculate}
                    onChange={(e) => updateField(id, "calculate", e.target.checked)}
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={rarity}
                    onChange={(e) => updateField(id, "rarity", Number(e.target.value))}
                    className="w-12 text-center"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="text"
                    value={sixStar}
                    onChange={(e) => updateField(id, "sixStar", e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="text"
                    value={skillNote}
                    onChange={(e) => updateField(id, "skillNote", e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    value={from1}
                    min={0}
                    onChange={(e) => updateField(id, "from1", Number(e.target.value))}
                    className="w-20 text-center"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    value={later}
                    min={0}
                    onChange={(e) => updateField(id, "later", Number(e.target.value))}
                    className="w-20 text-center"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    min={0}
                    max={2}
                    value={elite1}
                    onChange={(e) => updateField(id, "elite1", Number(e.target.value))}
                    className="w-16 text-center"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={level1}
                    onChange={(e) => updateField(id, "level1", Number(e.target.value))}
                    className="w-20 text-center"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    min={0}
                    max={2}
                    value={elite2}
                    onChange={(e) => updateField(id, "elite2", Number(e.target.value))}
                    className="w-16 text-center"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={level2}
                    onChange={(e) => updateField(id, "level2", Number(e.target.value))}
                    className="w-20 text-center"
                  />
                </td>
                <td className="border border-gray-300 p-1">{money.toLocaleString()}</td>
                <td className="border border-gray-300 p-1">{books.toLocaleString()}</td>
                <td className="border border-gray-300 p-1 space-x-1">
                  <button
                    className="px-2 py-0.5 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    onClick={() => moveUp(id)}
                    disabled={idx === 0}
                    title="上移"
                  >
                    ↑
                  </button>
                  <button
                    className="px-2 py-0.5 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    onClick={() => moveDown(id)}
                    disabled={idx === items.length - 1}
                    title="下移"
                  >
                    ↓
                  </button>
                  <button
                    className="px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => deleteRow(id)}
                    title="刪除"
                  >
                    ×
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {/* 新增行 */}
      <button
        onClick={addRow}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        新增行
      </button>

      {/* 輸出區摺疊 */}
      <button
        className="mb-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        onClick={() => setOutputVisible(!outputVisible)}
        disabled={items.length === 0}
      >
        {outputVisible ? "隱藏輸出區" : "顯示輸出區 (可複製 TSV)"}
      </button>
      {outputVisible && (
        <div className="mb-4 relative">
          <textarea
            rows={8}
            readOnly
            className="w-full p-2 border rounded resize-y font-mono"
            value={exportText}
            placeholder="請先按產生按鈕"
          />
          <button
            onClick={copyOutput}
            className="absolute top-2 right-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            一鍵複製
          </button>
          <button
            onClick={exportToTsv}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            產生 TSV
          </button>
        </div>
      )}
    </div>
  );
}
