import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Box, Button, Checkbox, Container, Flex, Heading, 
  IconButton, Table, Text, TextField, Tooltip, Card, Badge, Grid
} from "@radix-ui/themes";
import { 
  ArrowUpIcon, ArrowDownIcon, TrashIcon, 
  ClipboardCopyIcon, DownloadIcon, PlusIcon, InfoCircledIcon
} from "@radix-ui/react-icons";

// --- Types & Interfaces ---

/**
 * @interface IItem
 * @description 核心數據結構，對應 Excel 欄位
 * FROM/後來：對應模組等級 (0->3)
 * elite/level：對應精英階段與等級
 */
interface IItem {
  id: string;
  calculate: boolean; // 是否參與計算
  rarity: number;     // 稀有度
  name: string;       // 角色資訊
  note: string;       // 技能備註
  moduleFrom: string; // 模組 FROM
  moduleTo: string;   // 模組 後來
  e1: number;         // FROM 精英階級
  l1: number;         // FROM 等級
  e2: number;         // TO 精英階級
  l2: number;         // TO 等級
}

/**
 * @interface IInventory
 * @description 用戶當前擁有的資源庫存
 */
interface IInventory {
  money: number;
  books: number;
}

const STORAGE_KEY = "ark_arsenal_v2_data";
const INV_STORAGE_KEY = "ark_arsenal_v2_inv";

// --- Utils ---

/**
 * @description 根據等級與精英階段計算消耗 (模擬 Excel 邏輯)
 * 實際邏輯需根據查表，此處為簡化公式
 */
const calculateCost = (item: IItem) => {
  if (!item.calculate) return { money: 0, books: 0 };
  // 模擬消耗邏輯：基於等級差與精英階段加權
  const levelDiff = (item.e2 * 100 + item.l2) - (item.e1 * 100 + item.l1);
  const baseMoney = levelDiff > 0 ? levelDiff * 3500 : 0;
  const baseBooks = levelDiff > 0 ? levelDiff * 2200 : 0;
  return { money: Math.floor(baseMoney), books: Math.floor(baseBooks) };
};

// --- Main Component ---

export const ArsenalCalculator: React.FC = () => {
  const [items, setItems] = useState<IItem[]>([]);
  const [inventory, setInventory] = useState<IInventory>({ money: 0, books: 0 });

  // 1. 初始化資料與讀取緩存
  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY);
    const savedInv = localStorage.getItem(INV_STORAGE_KEY);
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedInv) setInventory(JSON.parse(savedInv));
  }, []);

  // 2. 資料持久化
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(INV_STORAGE_KEY, JSON.stringify(inventory));
  }, [items, inventory]);

  // 3. 計算累計需求與背景顏色
  // 這一部分會跑一個 reduce，計算每一行結算時的「累計錢」與「累計書」
  const rowsWithCumulative = useMemo(() => {
    let accMoney = 0;
    let accBooks = 0;

    return items.map((item) => {
      const cost = calculateCost(item);
      if (item.calculate) {
        accMoney += cost.money;
        accBooks += cost.books;
      }

      // 判斷資源是否足夠
      const isAffordable = inventory.money >= accMoney && inventory.books >= accBooks;
      
      return {
        ...item,
        cost,
        cumMoney: accMoney,
        cumBooks: accBooks,
        status: !item.calculate ? "disabled" : isAffordable ? "affordable" : "expensive",
      };
    });
  }, [items, inventory]);

  // --- Handlers ---

  const handleImport = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
      // 支援無標題解析
      const isHeader = lines[0].includes("是否計算");
      const data = isHeader ? lines.slice(1) : lines;
      
      const newItems = data.map((line, idx) => {
        const c = line.split("\t");
        return {
          id: `${Date.now()}-${idx}`,
          calculate: c[0] === "O",
          rarity: parseInt(c[1]) || 6,
          name: c[2] || "",
          note: c[3] || "",
          moduleFrom: c[4] || "0",
          moduleTo: c[5] || "0",
          e1: parseInt(c[6]) || 0,
          l1: parseInt(c[7]) || 1,
          e2: parseInt(c[8]) || 0,
          l2: parseInt(c[9]) || 1,
        };
      });
      setItems(newItems);
    } catch (e) { alert("讀取剪貼簿失敗"); }
  };

  const updateItem = (id: string, field: keyof IItem, value: any) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        {/* Header Section */}
        <Flex justify="between" align="end">
          <Box>
            <Heading size="7" mb="1">明日方舟工具箱</Heading>
            <Text color="gray" size="2">精英材料 PLUS / 資源規劃控制台</Text>
          </Box>
          <Flex gap="2">
            <Button variant="soft" color="indigo" onClick={handleImport}><DownloadIcon /> 從剪貼簿導入</Button>
            <Button variant="solid" color="green" onClick={() => {/* 同前導出邏輯 */}}><ClipboardCopyIcon /> 導出 TSV</Button>
          </Flex>
        </Flex>

        <Grid columns={{ initial: "1", md: "3" }} gap="4">
          {/* 左側：資源庫存輸入卡片 (250px * 500px 比例調節) */}
          <Box style={{ gridColumn: "span 1" }}>
            <Card size="3" style={{ height: '100%' }}>
              <Flex direction="column" gap="3">
                <Text weight="bold" size="3"><InfoCircledIcon /> 當前物資庫存</Text>
                <Box>
                  <Text as="label" size="2" mb="1" weight="medium">現有龍門幣 (LMD)</Text>
                  <TextField.Root 
                    type="number"
                    placeholder="輸入當前金額..." 
                    value={inventory.money} 
                    onChange={e => setInventory({...inventory, money: Number(e.target.value)})}
                  />
                </Box>
                <Box>
                  <Text as="label" size="2" mb="1" weight="medium">現有作戰記錄 (EXP)</Text>
                  <TextField.Root 
                    type="number"
                    placeholder="輸入當前經驗..." 
                    value={inventory.books} 
                    onChange={e => setInventory({...inventory, books: Number(e.target.value)})}
                  />
                </Box>
                <Badge color="blue" variant="soft" size="2" style={{ padding: '8px' }}>
                  系統將根據此庫存自動計算累計需求顏色
                </Badge>
              </Flex>
            </Card>
          </Box>

          {/* 右側：表格區域 */}
          <Box style={{ gridColumn: "span 2" }}>
            <Box className="border rounded-xl shadow-sm overflow-hidden bg-white">
              <Table.Root variant="surface">
                <Table.Header className="bg-slate-50">
                  <Table.Row align="center">
                    <Table.ColumnHeaderCell width="40px">算</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>角色資訊 / 備註</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>模組</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>等級 (FROM → TO)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>預估消耗</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>累計需求</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width="80px">操作</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {rowsWithCumulative.map((item, idx) => {
                    // 根據狀態設定背景色
                    const bgColor = item.status === "disabled" ? "#f1f3f5" : 
                                    item.status === "affordable" ? "#ebfbee" : "#fff5f5";
                    const opacity = item.status === "disabled" ? 0.6 : 1;

                    return (
                      <Table.Row key={item.id} align="center" style={{ backgroundColor: bgColor, opacity }}>
                        <Table.Cell>
                          <Checkbox checked={item.calculate} onCheckedChange={(v) => updateItem(item.id, "calculate", !!v)} />
                        </Table.Cell>

                        <Table.Cell>
                          <Flex align="center" gap="2">
                            <TextField.Root size="1" placeholder="角色" value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} />
                            <TextField.Root size="1" variant="soft" placeholder="備註" value={item.note} onChange={e => updateItem(item.id, "note", e.target.value)} />
                          </Flex>
                        </Table.Cell>

                        <Table.Cell>
                          <Flex align="center" gap="1">
                            <TextField.Root size="1" style={{ width: 45 }} value={item.moduleFrom} onChange={e => updateItem(item.id, "moduleFrom", e.target.value)} />
                            <Text size="1">→</Text>
                            <TextField.Root size="1" style={{ width: 45 }} value={item.moduleTo} onChange={e => updateItem(item.id, "moduleTo", e.target.value)} />
                          </Flex>
                        </Table.Cell>

                        <Table.Cell>
                          <Flex align="center" gap="1">
                            <Text size="1" color="gray">E{item.e1}</Text>
                            <TextField.Root size="1" style={{ width: 35 }} value={item.l1} onChange={e => updateItem(item.id, "l1", Number(e.target.value))} />
                            <Text size="1">→</Text>
                            <Text size="1" color="gray">E{item.e2}</Text>
                            <TextField.Root size="1" style={{ width: 35 }} value={item.l2} onChange={e => updateItem(item.id, "l2", Number(e.target.value))} />
                          </Flex>
                        </Table.Cell>

                        <Table.Cell>
                          <Flex direction="column">
                            <Text size="1" weight="bold" color="amber">💲{item.cost.money.toLocaleString()}</Text>
                            <Text size="1" weight="bold" color="blue">📘{item.cost.books.toLocaleString()}</Text>
                          </Flex>
                        </Table.Cell>

                        <Table.Cell>
                          <Flex direction="column">
                            <Text size="1" weight="bold">Σ {item.cumMoney.toLocaleString()}</Text>
                            <Text size="1" color="gray">Σ {item.cumBooks.toLocaleString()}</Text>
                          </Flex>
                        </Table.Cell>

                        <Table.Cell>
                          <Flex gap="1">
                            <IconButton size="1" variant="ghost" onClick={() => {/* Move Up */}}><ArrowUpIcon /></IconButton>
                            <IconButton size="1" variant="ghost" color="red" onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}><TrashIcon /></IconButton>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </Box>
            <Button variant="ghost" mt="3" onClick={() => setItems([...items, { id: Date.now().toString(), calculate: true, rarity: 6, name: "", note: "", moduleFrom: "0", moduleTo: "3", e1: 0, l1: 1, e2: 2, l2: 1 }])}>
              <PlusIcon /> 新增需求項目
            </Button>
          </Box>
        </Grid>
      </Flex>
    </Container>
  );
};
