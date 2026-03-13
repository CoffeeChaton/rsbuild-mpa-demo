import React, { useState, useEffect, useMemo } from "react";
import { 
  Box, Button, Checkbox, Flex, Heading, 
  IconButton, Table, Text, TextField, Card, Grid
} from "@radix-ui/themes";
import { 
  ArrowUpIcon, ArrowDownIcon, TrashIcon, 
  ClipboardCopyIcon, DownloadIcon, PlusIcon, InfoCircledIcon 
} from "@radix-ui/react-icons";

/**
 * ============================================================
 * AI HANDOVER PROTOCOL / I/O SPECIFICATION
 * ============================================================
 * 【LAYOUT CONSTANTS】
 * - NAV_BAR_HEIGHT: 70px (頂部導航欄高度，用於計算視窗剩餘空間)
 * * 【I/O - TSV】
 * 格式：是否計算(O/X) | 稀有度 | 角色名 | 技能備註 | FROM模組 | TO模組 | FROM精英 | FROM等級 | TO精英 | TO等級
 * * 【PERSISTENCE】
 * Key: ark_arsenal_v6_final (保持一致，避免資料遺失)
 * ============================================================
 */

interface IItem {
  id: string;
  calculate: boolean;
  name: string;
  note: string;
  moduleFrom: string; 
  moduleTo: string;
  e1: number; l1: number;
  e2: number; l2: number;
}

interface IInventory {
  money: number;
  books: number;
}

const STORAGE_KEY = "ark_arsenal_v6_final";
const NAV_BAR_HEIGHT = 70; // 預留導航欄高度常數

export const ArsenalCalculator: React.FC = () => {
  const [items, setItems] = useState<IItem[]>([]);
  const [inventory, setInventory] = useState<IInventory>({ money: 0, books: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { items: sItems, inv: sInv } = JSON.parse(saved);
        if (sItems) setItems(sItems);
        if (sInv) setInventory(sInv);
      } catch (e) { console.error("Restore failed"); }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, inv: inventory }));
    }
  }, [items, inventory, isLoaded]);

  // --- Logic ---
  const rows = useMemo(() => {
    let accMoney = 0; let accBooks = 0;
    return items.map((item) => {
      const diff = (item.e2 * 100 + item.l2) - (item.e1 * 100 + item.l1);
      const costMoney = item.calculate && diff > 0 ? diff * 4800 : 0;
      const costBooks = item.calculate && diff > 0 ? diff * 3200 : 0;
      if (item.calculate) { accMoney += costMoney; accBooks += costBooks; }
      
      const isAffordable = inventory.money >= accMoney && inventory.books >= accBooks;
      return { 
        ...item, costMoney, costBooks, cumMoney: accMoney, cumBooks: accBooks,
        status: !item.calculate ? "disabled" : isAffordable ? "safe" : "danger"
      };
    });
  }, [items, inventory]);

  // --- Handlers ---
  const handleImport = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
      const dataLines = (lines[0].includes("計算") || lines[0].includes("角色")) ? lines.slice(1) : lines;

      const newItems: IItem[] = dataLines.map(line => {
        const c = line.split("\t");
        return {
          id: crypto.randomUUID(),
          calculate: c[0]?.trim() === "O",
          name: c[2] || "",
          note: c[3] || "",
          moduleFrom: c[4] || "0",
          moduleTo: c[5] || "3",
          e1: Number(c[6]) || 0, l1: Number(c[7]) || 1,
          e2: Number(c[8]) || 0, l2: Number(c[9]) || 1,
        };
      });
      setItems(newItems);
    } catch (err) { alert("貼上失敗"); }
  };

  const handleExport = () => {
    const header = "是否計算\t稀有度\t角色名\t技能備註\tFROM\tTO\t精1\t等1\t精2\t等2\t預估錢\t預估書\t累計錢\t累計書";
    const body = rows.map(r => 
      `${r.calculate ? "O" : "X"}\t6\t${r.name}\t${r.note}\t${r.moduleFrom}\t${r.moduleTo}\t${r.e1}\t${r.l1}\t${r.e2}\t${r.l2}\t${r.costMoney}\t${r.costBooks}\t${r.cumMoney}\t${r.cumBooks}`
    ).join("\n");
    navigator.clipboard.writeText(header + "\n" + body);
    alert("TSV 已複製到剪貼簿");
  };

  const moveRow = (idx: number, delta: number) => {
    const next = idx + delta;
    if (next < 0 || next >= items.length) return;
    const list = [...items];
    [list[idx], list[next]] = [list[next], list[idx]];
    setItems(list);
  };

  const updateItem = (id: string, field: keyof IItem, value: any) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <Box 
      p="4" 
      style={{ 
        height: `calc(100vh - ${NAV_BAR_HEIGHT}px)`, // 扣除上方導航欄常數
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        background: 'var(--gray-2)' 
      }}
    >
      <Flex justify="between" align="end" mb="4">
        <Heading size="7">Arsenal Calculator</Heading>
        <Flex gap="3">
          <Button variant="soft" onClick={handleImport}><DownloadIcon /> 從剪貼簿導入</Button>
          <Button variant="solid" color="green" onClick={handleExport}><ClipboardCopyIcon /> 導出 TSV</Button>
        </Flex>
      </Flex>

      <Grid columns={{ initial: "1", lg: "280px 1fr" }} gap="4" style={{ flex: 1, overflow: 'hidden' }}>
        {/* 左側庫存 */}
        <Box>
          <Card size="3">
            <Flex direction="column" gap="4">
              <Text weight="bold" size="3"><InfoCircledIcon /> 物資庫存</Text>
              <Box>
                <Text size="1" color="gray" mb="1" as="div">現有龍門幣 (LMD)</Text>
                <TextField.Root type="number" value={inventory.money} onChange={e => setInventory(p => ({ ...p, money: Number(e.target.value) }))} />
              </Box>
              <Box>
                <Text size="1" color="gray" mb="1" as="div">現有作戰記錄 (EXP)</Text>
                <TextField.Root type="number" value={inventory.books} onChange={e => setInventory(p => ({ ...p, books: Number(e.target.value) }))} />
              </Box>
            </Flex>
          </Card>
        </Box>

        {/* 右側列表 */}
        <Flex direction="column" gap="3" style={{ overflow: 'hidden' }}>
          <Box 
            className="border rounded-xl shadow-sm bg-white" 
            style={{ 
              flex: 1, 
              overflowY: 'scroll', // 始終顯示垂直滾動條
              overflowX: 'auto' 
            }}
          >
            <Table.Root variant="surface">
              <Table.Header className="bg-slate-50">
                <Table.Row>
                  <Table.ColumnHeaderCell width="40px">算</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="150px">角色</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="150px">備註</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="100px">模組</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="180px">等級 (F → T)</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="100px">預估錢</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="100px">預估書</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="130px">累計錢</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="130px">累計書</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="120px" align="center">操作</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {rows.map((item, idx) => {
                  const bgColor = item.status === "disabled" ? "#f9f9f9" : item.status === "safe" ? "#f2fcf5" : "#fff5f5";
                  const numStyle: React.CSSProperties = { whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', fontSize: '13px' };
                  return (
                    <Table.Row key={item.id} align="center" style={{ backgroundColor: bgColor }}>
                      <Table.Cell><Checkbox checked={item.calculate} onCheckedChange={(v) => updateItem(item.id, "calculate", !!v)} /></Table.Cell>
                      <Table.Cell>
                        <TextField.Root size="1" value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} />
                      </Table.Cell>
                      <Table.Cell>
                        <TextField.Root size="1" variant="soft" value={item.note} onChange={e => updateItem(item.id, "note", e.target.value)} />
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
                          <TextField.Root type="number" size="1" style={{ width: 32 }} value={item.e1} onChange={e => updateItem(item.id, "e1", Number(e.target.value))} />
                          <TextField.Root type="number" size="1" style={{ width: 42 }} value={item.l1} onChange={e => updateItem(item.id, "l1", Number(e.target.value))} />
                          <Text size="1">→</Text>
                          <TextField.Root type="number" size="1" style={{ width: 32 }} value={item.e2} onChange={e => updateItem(item.id, "e2", Number(e.target.value))} />
                          <TextField.Root type="number" size="1" style={{ width: 42 }} value={item.l2} onChange={e => updateItem(item.id, "l2", Number(e.target.value))} />
                        </Flex>
                      </Table.Cell>
                      <Table.Cell><Text weight="bold" color="amber" style={numStyle}>{item.costMoney.toLocaleString()}</Text></Table.Cell>
                      <Table.Cell><Text weight="bold" color="blue" style={numStyle}>{item.costBooks.toLocaleString()}</Text></Table.Cell>
                      <Table.Cell><Text weight="bold" style={numStyle}>Σ {item.cumMoney.toLocaleString()}</Text></Table.Cell>
                      <Table.Cell><Text color="gray" style={numStyle}>Σ {item.cumBooks.toLocaleString()}</Text></Table.Cell>
                      <Table.Cell>
                        <Flex gap="1" justify="center">
                          <IconButton size="1" variant="ghost" disabled={idx === 0} onClick={() => moveRow(idx, -1)}><ArrowUpIcon /></IconButton>
                          <IconButton size="1" variant="ghost" disabled={idx === items.length - 1} onClick={() => moveRow(idx, 1)}><ArrowDownIcon /></IconButton>
                          <IconButton size="1" variant="ghost" color="red" onClick={() => setItems(items.filter(i => i.id !== item.id))}><TrashIcon /></IconButton>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Box>
          <Box>
            <Button variant="ghost" size="3" onClick={() => setItems([...items, { id: crypto.randomUUID(), calculate: true, name: "", note: "", moduleFrom: "0", moduleTo: "3", e1: 0, l1: 1, e2: 2, l2: 1 }])}>
              <PlusIcon /> 新增需求項目
            </Button>
          </Box>
        </Flex>
      </Grid>
    </Box>
  );
};
