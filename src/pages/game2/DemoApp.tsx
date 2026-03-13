import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Box, Button, Checkbox, Container, Flex, Heading, 
  IconButton, Table, Text, TextField, Card, Badge, Grid
} from "@radix-ui/themes";
import { 
  ArrowUpIcon, ArrowDownIcon, TrashIcon, 
  ClipboardCopyIcon, DownloadIcon, PlusIcon, InfoCircledIcon 
} from "@radix-ui/react-icons";

/**
 * AI Context & User Intent:
 * 1. 修復剪貼簿導入：精確對齊用戶提供的 Excel 欄位（是否計算, 稀有度, 角色...）。
 * 2. 修復 localStorage：解決初始渲染時空數據覆蓋本地緩存的問題。
 * 3. 布局優化：固定左側庫存 Card 寬度，確保 1080p 下操作按鈕不位移。
 * 4. 程式規範：嚴禁 export default，使用 React.FC，自定義 Interface 以 I 開頭。
 */

interface IItem {
  id: string;
  calculate: boolean;
  name: string;
  note: string;
  moduleFrom: string; 
  moduleTo: string;
  e1: number; // 精英 FROM
  l1: number; // 等級 FROM
  e2: number; // 精英 TO
  l2: number; // 等級 TO
}

interface IInventory {
  money: number;
  books: number;
}

const ITEMS_KEY = "ark_arsenal_items_v3_fixed";
const INV_KEY = "ark_arsenal_inv_v3_fixed";

export const ArsenalCalculator: React.FC = () => {
  const [items, setItems] = useState<IItem[]>([]);
  const [inventory, setInventory] = useState<IInventory>({ money: 0, books: 0 });
  const [isLoaded, setIsLoaded] = useState(false); // 防止初始空數據覆蓋緩存

  // --- 1. 讀取緩存 (僅執行一次) ---
  useEffect(() => {
    const sItems = localStorage.getItem(ITEMS_KEY);
    const sInv = localStorage.getItem(INV_KEY);
    if (sItems) {
      try {
        setItems(JSON.parse(sItems));
      } catch (e) {
        console.error("Failed to parse items", e);
      }
    }
    if (sInv) {
      try {
        setInventory(JSON.parse(sInv));
      } catch (e) {
        console.error("Failed to parse inventory", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // --- 2. 保存緩存 (當 isLoaded 為 true 且數據變動時) ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
      localStorage.setItem(INV_KEY, JSON.stringify(inventory));
    }
  }, [items, inventory, isLoaded]);

  // --- 3. 計算邏輯 ---
  const rows = useMemo(() => {
    let accMoney = 0;
    let accBooks = 0;

    return items.map((item) => {
      // 假設性消耗計算 (AI接手請根據 Excel 邏輯公式化)
      const diff = (item.e2 * 100 + item.l2) - (item.e1 * 100 + item.l1);
      const costMoney = item.calculate && diff > 0 ? diff * 4500 : 0;
      const costBooks = item.calculate && diff > 0 ? diff * 2800 : 0;

      if (item.calculate) {
        accMoney += costMoney;
        accBooks += costBooks;
      }

      const isAffordable = inventory.money >= accMoney && inventory.books >= accBooks;

      return {
        ...item,
        costMoney, costBooks,
        cumMoney: accMoney, cumBooks: accBooks,
        status: !item.calculate ? "disabled" : isAffordable ? "safe" : "danger"
      };
    });
  }, [items, inventory]);

  // --- 4. 剪貼簿讀取修復 ---
  const handleImport = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
      
      // 判斷是否包含標題行（"是否計算" 或 "稀有度" 等字眼）
      const hasHeader = lines[0].includes("計算") || lines[0].includes("稀有度");
      const dataRows = hasHeader ? lines.slice(1) : lines;

      const newItems: IItem[] = dataRows.map((line) => {
        const c = line.split("\t");
        // 對齊截圖中的 TSV 順序: 
        // 0:是否計算(O/X), 1:稀有度, 2:角色名, 3:技能備註, 
        // 4:FROM模組, 5:TO模組, 6:FROM精英, 7:FROM等級, 8:TO精英, 9:TO等級
        return {
          id: crypto.randomUUID(),
          calculate: c[0] === "O", 
          name: c[2] || "",
          note: c[3] || "",
          moduleFrom: c[4] || "0",
          moduleTo: c[5] || "3",
          e1: Number(c[6]) || 0,
          l1: Number(c[7]) || 1,
          e2: Number(c[8]) || 0,
          l2: Number(c[9]) || 1,
        };
      });

      if (newItems.length > 0) {
        setItems(newItems);
      }
    } catch (err) {
      alert("讀取剪貼簿失敗，請確保已複製 Excel 的 TSV 數據。");
    }
  };

  const moveRow = (idx: number, delta: number) => {
    const next = idx + delta;
    if (next < 0 || next >= items.length) return;
    const newArr = [...items];
    [newArr[idx], newArr[next]] = [newArr[next], newArr[idx]];
    setItems(newArr);
  };

  const updateItem = (id: string, field: keyof IItem, value: any) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <Container size="4" p="5" style={{ maxWidth: '1860px' }}>
      <Flex direction="column" gap="5">
        <Flex justify="between" align="end">
          <Box>
            <Heading size="8" weight="bold">Arsenal Calculator</Heading>
            <Text color="gray" size="2">資源累計與庫存對照面板 (Fix: Storage & Import)</Text>
          </Box>
          <Flex gap="3">
            <Button variant="soft" color="indigo" size="3" onClick={handleImport}><DownloadIcon /> 從剪貼簿導入</Button>
            <Button variant="solid" color="green" size="3"><ClipboardCopyIcon /> 導出 TSV</Button>
          </Flex>
        </Flex>

        <Grid columns="280px 1fr" gap="6" align="start">
          <Box>
            <Card size="3" style={{ position: 'sticky', top: '20px' }}>
              <Flex direction="column" gap="4">
                <Flex align="center" gap="2"><InfoCircledIcon /><Text weight="bold">物資庫存</Text></Flex>
                <Box>
                  <Text as="div" size="2" weight="bold" mb="1" color="gray">龍門幣 (LMD)</Text>
                  <TextField.Root type="number" size="3" value={inventory.money} onChange={e => setInventory(p => ({ ...p, money: Number(e.target.value) }))} />
                </Box>
                <Box>
                  <Text as="div" size="2" weight="bold" mb="1" color="gray">作戰記錄 (EXP)</Text>
                  <TextField.Root type="number" size="3" value={inventory.books} onChange={e => setInventory(p => ({ ...p, books: Number(e.target.value) }))} />
                </Box>
                <Badge color="blue" variant="soft" style={{ padding: '12px' }}>數據已與 localStorage 同步。</Badge>
              </Flex>
            </Card>
          </Box>

          <Box className="bg-white border rounded-2xl shadow-sm overflow-hidden">
            <Table.Root variant="surface">
              <Table.Header className="bg-slate-50">
                <Table.Row align="center">
                  <Table.ColumnHeaderCell width="40px">算</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell minWidth="240px">角色與備註</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="110px">模組</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="180px">等級 (FROM → TO)</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="100px">預估錢</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="100px">預估書</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="120px">累計錢</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="120px">累計書</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="100px" align="center">操作</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {rows.map((item, idx) => {
                  const isSafe = item.status === "safe";
                  const isDisabled = item.status === "disabled";
                  return (
                    <Table.Row key={item.id} align="center" style={{ 
                        backgroundColor: isDisabled ? "#f1f3f5" : isSafe ? "#f2fcf5" : "#fff5f5",
                        opacity: isDisabled ? 0.7 : 1 
                      }}>
                      <Table.Cell>
                        <Checkbox checked={item.calculate} onCheckedChange={(v) => updateItem(item.id, "calculate", !!v)} />
                      </Table.Cell>
                      <Table.Cell>
                        <Flex gap="2">
                          <TextField.Root size="1" style={{ flex: 1.5 }} value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} />
                          <TextField.Root size="1" style={{ flex: 1 }} variant="soft" value={item.note} onChange={e => updateItem(item.id, "note", e.target.value)} />
                        </Flex>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex align="center" gap="1">
                          <TextField.Root size="1" style={{ width: 40 }} value={item.moduleFrom} onChange={e => updateItem(item.id, "moduleFrom", e.target.value)} />
                          <Text size="1">→</Text>
                          <TextField.Root size="1" style={{ width: 40 }} value={item.moduleTo} onChange={e => updateItem(item.id, "moduleTo", e.target.value)} />
                        </Flex>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex align="center" gap="1">
                          <TextField.Root type="number" size="1" style={{ width: 35 }} value={item.e1} onChange={e => updateItem(item.id, "e1", Number(e.target.value))} />
                          <TextField.Root type="number" size="1" style={{ width: 42 }} value={item.l1} onChange={e => updateItem(item.id, "l1", Number(e.target.value))} />
                          <Text size="1">→</Text>
                          <TextField.Root type="number" size="1" style={{ width: 35 }} value={item.e2} onChange={e => updateItem(item.id, "e2", Number(e.target.value))} />
                          <TextField.Root type="number" size="1" style={{ width: 42 }} value={item.l2} onChange={e => updateItem(item.id, "l2", Number(e.target.value))} />
                        </Flex>
                      </Table.Cell>
                      <Table.Cell><Text size="1" weight="bold" color="amber">{item.costMoney.toLocaleString()}</Text></Table.Cell>
                      <Table.Cell><Text size="1" weight="bold" color="blue">{item.costBooks.toLocaleString()}</Text></Table.Cell>
                      <Table.Cell><Text size="2" weight="bold">Σ {item.cumMoney.toLocaleString()}</Text></Table.Cell>
                      <Table.Cell><Text size="2" color="gray">Σ {item.cumBooks.toLocaleString()}</Text></Table.Cell>
                      <Table.Cell>
                        <Flex gap="1" justify="center">
                          <IconButton size="1" variant="ghost" disabled={idx === 0} onClick={() => moveRow(idx, -1)}><ArrowUpIcon /></IconButton>
                          <IconButton size="1" variant="ghost" disabled={idx === items.length - 1} onClick={() => moveRow(idx, 1)}><ArrowDownIcon /></IconButton>
                          <IconButton size="1" variant="ghost" color="red" onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}><TrashIcon /></IconButton>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
            <Box p="3" className="bg-slate-50">
              <Button variant="ghost" onClick={() => setItems([...items, { id: crypto.randomUUID(), calculate: true, name: "", note: "", moduleFrom: "0", moduleTo: "3", e1: 0, l1: 1, e2: 2, l2: 1 }])}>
                <PlusIcon /> 新增需求項目
              </Button>
            </Box>
          </Box>
        </Grid>
      </Flex>
    </Container>
  );
};
