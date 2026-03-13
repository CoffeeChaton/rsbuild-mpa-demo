import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Box, Button, Checkbox, Container, Flex, Heading, 
  IconButton, Table, Text, TextField, Tooltip, Callout 
} from "@radix-ui/themes";
import { 
  ArrowUpIcon, ArrowDownIcon, TrashIcon, 
  ClipboardCopyIcon, DownloadIcon, PlusIcon 
} from "@radix-ui/react-icons";

// --- Types & Constants ---

/**
 * @description 核心數據結構
 * 從 TSV 導入的數據會被轉化為此結構。
 * FROM/後來 目前作為字串處理，以支援 "0->3" 這種輸入。
 */
interface IItem {
  id: string; // 使用 nanoid 或 Date.now 作為唯一識別碼
  calculate: boolean; 
  rarity: number; 
  sixStar: string; 
  skillNote: string; 
  from1: string; 
  later: string; 
  elite1: number; 
  level1: number; 
  elite2: number; 
  level2: number;
}

const STORAGE_KEY = "ark_arsenal_calc_v1";

// --- Logic Functions ---

/**
 * @description 計算錢與書的消耗
 * TODO: 目前為範例公式，未來 AI 接入時可根據精英階段與等級進行精確查表
 */
function calculateCost(item: IItem) {
  if (!item.calculate) return { money: 0, books: 0 };
  const diff = Math.max(0, item.level2 - item.level1);
  const multiplier = item.rarity === 6 ? 1.5 : 1.0;
  return {
    money: Math.floor(diff * 5000 * multiplier),
    books: Math.floor(diff * 10 * multiplier),
  };
}

/**
 * @description 強大的 TSV 解析器
 * 支援有無標題行的情況。如果第一行不是數字或 O/X，則視為標題並跳過。
 */
function parseTsvToItems(tsv: string): IItem[] {
  const lines = tsv.trim().split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return [];

  const firstLine = lines[0].split("\t");
  const hasHeader = firstLine.some(cell => ["是否計算", "六星", "稀有度"].includes(cell.trim()));
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines.map((line, idx) => {
    const cols = line.split("\t");
    return {
      id: `${Date.now()}-${idx}`,
      calculate: cols[0]?.trim().toUpperCase() === "O",
      rarity: parseInt(cols[1]) || 6,
      sixStar: cols[2] || "",
      skillNote: cols[3] || "",
      from1: cols[4] || "0",
      later: cols[5] || "0",
      elite1: parseInt(cols[6]) || 0,
      level1: parseInt(cols[7]) || 1,
      elite2: parseInt(cols[8]) || 0,
      level2: parseInt(cols[9]) || 1,
    };
  });
}

// --- Main Component ---

export const ArsenalCalculator: React.FC = () => {
  const [items, setItems] = useState<IItem[]>([]);

  // 1. 初始化與緩存讀取
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { console.error("Cache corrupted"); }
    }
  }, []);

  // 2. 持久化保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // 3. 計算總計
  const totals = useMemo(() => {
    return items.reduce((acc, item) => {
      const { money, books } = calculateCost(item);
      acc.money += money;
      acc.books += books;
      return acc;
    }, { money: 0, books: 0 });
  }, [items]);

  // 4. 操作行為
  const handleImport = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const newItems = parseTsvToItems(text);
      if (newItems.length > 0) setItems(newItems);
    } catch (err) {
      alert("無法讀取剪貼簿，請確保已授權權限");
    }
  }, []);

  const handleExport = useCallback(() => {
    const header = "是否計算\t稀有度\t六星\t技能備註\tFROM\t後來\t精英1\t等級1\t精英2\t等級2\n";
    const body = items.map(i => 
      `${i.calculate ? 'O' : 'X'}\t${i.rarity}\t${i.sixStar}\t${i.skillNote}\t${i.from1}\t${i.later}\t${i.elite1}\t${i.level1}\t${i.elite2}\t${i.level2}`
    ).join("\n");
    navigator.clipboard.writeText(header + body);
    alert("已將 TSV 數據複製到剪貼簿");
  }, [items]);

  const updateItem = (id: string, field: keyof IItem, value: unknown) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const moveRow = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[nextIndex]] = [newItems[nextIndex], newItems[index]];
    setItems(newItems);
  };

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Heading size="6">Arsenal Calculator PLUS</Heading>
          <Flex gap="2">
            <Button variant="soft" color="indigo" onClick={handleImport}>
              <DownloadIcon /> 從剪貼簿導入
            </Button>
            <Button variant="soft" color="green" onClick={handleExport}>
              <ClipboardCopyIcon /> 導出 TSV
            </Button>
          </Flex>
        </Flex>

        <Box className="overflow-x-auto border rounded-xl shadow-sm">
          <Table.Root variant="surface">
            <Table.Header className="bg-slate-50">
              <Table.Row>
                <Table.ColumnHeaderCell width="40px">算</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>角色資訊</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>進度 (FROM/後來)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>目標 (精英/等級)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>預估消耗</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell width="120px">操作</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {items.map((item, idx) => {
                const costs = calculateCost(item);
                return (
                  <Table.Row key={item.id} align="center">
                    <Table.Cell>
                      <Checkbox 
                        checked={item.calculate} 
                        onCheckedChange={(v) => updateItem(item.id, "calculate", !!v)} 
                      />
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Flex direction="column" gap="1">
                        <TextField.Root 
                          size="1" 
                          placeholder="角色名" 
                          value={item.sixStar} 
                          onChange={e => updateItem(item.id, "sixStar", e.target.value)}
                        />
                        <TextField.Root 
                          size="1" 
                          variant="soft"
                          placeholder="備註" 
                          value={item.skillNote} 
                          onChange={e => updateItem(item.id, "skillNote", e.target.value)}
                        />
                      </Flex>
                    </Table.Cell>

                    <Table.Cell>
                      <Flex gap="2">
                        <TextField.Root size="1" value={item.from1} onChange={e => updateItem(item.id, "from1", e.target.value)} style={{ width: 60 }} />
                        <Text size="1" color="gray">→</Text>
                        <TextField.Root size="1" value={item.later} onChange={e => updateItem(item.id, "later", e.target.value)} style={{ width: 60 }} />
                      </Flex>
                    </Table.Cell>

                    <Table.Cell>
                      <Flex gap="2" align="center">
                        <TextField.Root type="number" size="1" value={item.elite2} onChange={e => updateItem(item.id, "elite2", Number(e.target.value))} style={{ width: 40 }} />
                        <Text size="1" color="gray">E / Lv</Text>
                        <TextField.Root type="number" size="1" value={item.level2} onChange={e => updateItem(item.id, "level2", Number(e.target.value))} style={{ width: 50 }} />
                      </Flex>
                    </Table.Cell>

                    <Table.Cell>
                      <Flex direction="column">
                        <Text size="1" color="gold" weight="bold">LMD: {costs.money.toLocaleString()}</Text>
                        <Text size="1" color="blue">EXP: {costs.books.toLocaleString()}</Text>
                      </Flex>
                    </Table.Cell>

                    <Table.Cell>
                      <Flex gap="1">
                        <Tooltip content="上移">
                          <IconButton size="1" variant="ghost" disabled={idx === 0} onClick={() => moveRow(idx, 'up')}><ArrowUpIcon /></IconButton>
                        </Tooltip>
                        <Tooltip content="下移">
                          <IconButton size="1" variant="ghost" disabled={idx === items.length - 1} onClick={() => moveRow(idx, 'down')}><ArrowDownIcon /></IconButton>
                        </Tooltip>
                        <Tooltip content="刪除">
                          <IconButton size="1" variant="ghost" color="red" onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}><TrashIcon /></IconButton>
                        </Tooltip>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Box>

        <Button variant="ghost" onClick={() => setItems(prev => [...prev, {
          id: Date.now().toString(), calculate: true, rarity: 6, sixStar: "", skillNote: "", from1: "0", later: "3", elite1: 0, level1: 1, elite2: 2, level2: 1
        }])}>
          <PlusIcon /> 新增行
        </Button>

        <Callout.Root color="blue" size="1">
          <Callout.Icon>ℹ️</Callout.Icon>
          <Callout.Text>
            總計需求：<strong>{totals.money.toLocaleString()} LMD</strong> (龍門幣) | <strong>{totals.books.toLocaleString()} EXP</strong> (作戰記錄)
          </Callout.Text>
        </Callout.Root>
      </Flex>
    </Container>
  );
};
