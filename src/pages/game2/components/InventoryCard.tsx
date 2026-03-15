// src/pages/game2/components/InventoryCard.tsx

import React from "react";
import { Button, Card, Flex, Grid, ScrollArea, Separator, Text, TextField, Tooltip } from "@radix-ui/themes";
import {
  BOOK_CONFIG,
  calculateBookStacksValue,
  DEFAULT_BOOK_STACKS,
  type IBookStacks,
  type IInventory,
} from "../types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import { DownloadIcon, UploadIcon } from "@radix-ui/react-icons";

interface IInventoryCardProps {
  inventory: IInventory;
  onUpdate: (update: Partial<IInventory>) => void;
}

const clampPositiveNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
};

const sanitize = (val: string) => Math.max(0, Math.floor(Number(val)) || 0);
type ProductionFieldKey = "avgMoneyProduction" | "avgBookProduction";

const PRODUCTION_FIELDS: { key: ProductionFieldKey, label: string, unit: string }[] = [
  { key: "avgMoneyProduction", label: "平均龍門幣產出", unit: "LMD" },
  { key: "avgBookProduction", label: "平均經驗書產出", unit: "EXP" },
];

const STACK_FIELDS = [
  { id: "stack_advanced", label: "高級作戰紀錄(個)", index: 0 },
  { id: "stack_intermediate", label: "中級作戰紀錄(個)", index: 1 },
  { id: "stack_primary", label: "初級作戰紀錄(個)", index: 2 },
  { id: "stack_basic", label: "基礎作戰紀錄(個)", index: 3 },
];

const INVENTORY_CLIPBOARD_FIELDS = [
  { id: "money", label: "龍門幣", getter: (inv: IInventory) => inv.money },
  {
    id: "inventory_books_calc",
    label: "庫存經驗值(計算)",
    getter: (_inv: IInventory, stacks?: IBookStacks) => calculateBookStacksValue(stacks ?? DEFAULT_BOOK_STACKS),
  },
  ...STACK_FIELDS.map(field => ({
    id: field.id,
    label: field.label,
    getter: (_inv: IInventory, stacks?: IBookStacks) => stacks?.[field.index] ?? 0,
  })),
  { id: "avgMoneyProduction", label: "日產龍門幣", getter: (inv: IInventory) => inv.avgMoneyProduction },
  { id: "avgBookProduction", label: "日產EXP", getter: (inv: IInventory) => inv.avgBookProduction },
] as const;

export const InventoryCard: React.FC<IInventoryCardProps> = ({
  inventory,
  onUpdate,
}) => {
  const bookStacks = inventory.bookStacks ?? DEFAULT_BOOK_STACKS;
  const totalExpValue = calculateBookStacksValue(bookStacks);

  const handleStackChange = (index: number, value: string) => {
    const nextStacks: IBookStacks = [...bookStacks];
    nextStacks[index] = sanitize(value);

    onUpdate({
      bookStacks: nextStacks,
      books: calculateBookStacksValue(nextStacks),
    });
  };

  const handleProductionChange = (key: ProductionFieldKey, value: string) => {
    onUpdate({
      [key]: clampPositiveNumber(value),
    } as Pick<IInventory, ProductionFieldKey>);
  };

  const handleClipboardImport = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const lines = text.trim().split(/\r?\n/).filter(Boolean);
      if (lines.length === 0) return alert("未找到資料，請確認已複製 Excel 內容。");

      const nextStacks: IBookStacks = [...bookStacks];
      let stacksTouched = false;
      let money = inventory.money;
      let avgMoney = inventory.avgMoneyProduction;
      let avgBook = inventory.avgBookProduction;

      const findField = (tokens: string[]) => {
        if (tokens.length === 0) return undefined;
        const key = tokens[0].trim().toLowerCase();
        const labelCandidate = tokens[1]?.trim();

        const byId = INVENTORY_CLIPBOARD_FIELDS.find(field => field.id === key);
        if (byId) return byId;

        if (labelCandidate) {
          const byLabel = INVENTORY_CLIPBOARD_FIELDS.find(field => field.label === labelCandidate);
          if (byLabel) return byLabel;
        }

        const byLabelFirst = INVENTORY_CLIPBOARD_FIELDS.find(field => field.label === tokens[0]);
        if (byLabelFirst) return byLabelFirst;

        return undefined;
      };

      lines.forEach(line => {
        const rawCells = line.split("\t");
        if (rawCells.length < 2) return;
        const valueCell = rawCells[rawCells.length - 1]?.trim();
        const field = findField(rawCells);
        if (!field || !valueCell) return;

        if (field.id === "money") {
          money = clampPositiveNumber(valueCell);
        } else if (field.id === "avgMoneyProduction") {
          avgMoney = clampPositiveNumber(valueCell);
        } else if (field.id === "avgBookProduction") {
          avgBook = clampPositiveNumber(valueCell);
        } else {
          const stackField = STACK_FIELDS.find(s => s.id === field.id);
          if (stackField) {
            nextStacks[stackField.index] = sanitize(valueCell);
            stacksTouched = true;
          }
        }
      });

      const update: Partial<IInventory> = {
        money,
        avgMoneyProduction: avgMoney,
        avgBookProduction: avgBook,
      };
      if (stacksTouched) {
        update.bookStacks = nextStacks;
        update.books = calculateBookStacksValue(nextStacks);
      }

      onUpdate(update);
      alert("已貼上並套用庫存資料。");
    } catch (error) {
      console.error("貼上庫存失敗", error);
      alert("貼上失敗，請確認瀏覽器允許讀取剪貼簿。");
    }
  };

  const handleClipboardExport = async () => {
    const lines = INVENTORY_CLIPBOARD_FIELDS.map(field => {
      const value = field.getter(inventory, bookStacks);
      return `${field.id}\t${field.label}\t${value}`;
    }).join("\n");
    try {
      await navigator.clipboard.writeText(lines);
      alert("庫存資料 (TSV) 已複製，可貼到 Excel。");
    } catch (error) {
      console.error("複製庫存失敗", error);
      alert("複製失敗，請確認瀏覽器允許寫入剪貼簿。");
    }
  };

  return (
    <Card size="2" className="flex h-full flex-col overflow-hidden">
      <Flex direction="column" gap="4" className="flex-1 min-h-0">
        <Flex align="center" justify="between" className="flex-wrap gap-3">
          <Flex direction="column" gap="1">
            <Text size="3" weight="bold">更新你的龍門幣 / 作戰記錄</Text>
            <Text size="1" color="gray">調整數值會同步保存，其他區塊可直接使用。</Text>
          </Flex>
          <Flex align="center" gap="2" className="flex-wrap">
            <Button variant="soft" size="2" onClick={handleClipboardImport}>
              <UploadIcon /> 從 Excel 導入
            </Button>
            <Button variant="outline" size="2" onClick={handleClipboardExport}>
              <DownloadIcon /> 匯出 TSV
            </Button>
          </Flex>
        </Flex>

        <Flex align="center" gap="1" className="whitespace-nowrap">
          <Text size="1" color="gray" weight="bold">庫存</Text>
          <Separator size="4" />
        </Flex>

        <Grid columns="140px 1fr" gap="3" align="center">
          <Text size="1" weight="bold">龍門幣</Text>
          <TextField.Root
            size="1"
            variant="soft"
            placeholder="輸入目前持有量"
            type="number"
            min="0"
            step="100"
            inputMode="numeric"
            value={inventory.money}
            onChange={(e) => onUpdate({ money: clampPositiveNumber(e.target.value) })}
            className="tabular-nums"
          />
        </Grid>

        <Accordion type="multiple">
          <AccordionItem value="exp">
            <AccordionTrigger>
              <Flex gap="2" align="center">
                <Text size="2" weight="bold">作戰記錄</Text>
                <Text size="1" color="gray">合計 {totalExpValue.toLocaleString()} EXP</Text>
              </Flex>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea scrollbars="vertical" style={{ maxHeight: 220 }}>
                <Flex direction="column" gap="2" pr="3" pt="1">
                  {BOOK_CONFIG.map((conf, i) => (
                    <Grid key={conf.label} columns="140px 1fr" gap="3" align="center">
                      <Tooltip content={`${conf.label}：每份 ${conf.value.toLocaleString()} EXP`}>
                        <Text size="1" color="gray" weight="bold" className="truncate">
                          • {conf.label}
                        </Text>
                      </Tooltip>
                      <TextField.Root
                        size="1"
                        variant="soft"
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        value={bookStacks[i] ?? 0}
                        onChange={(e) => handleStackChange(i, e.target.value)}
                        className="tabular-nums"
                      />
                    </Grid>
                  ))}
                </Flex>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Flex align="center" gap="1" className="whitespace-nowrap">
          <Text size="1" color="gray" weight="bold">產能</Text>
          <Separator size="4" />
        </Flex>

        <Flex direction="column" gap="3">
          {PRODUCTION_FIELDS.map(field => (
            <Grid key={field.key} columns="140px 1fr" gap="3">
              <Flex direction="column" gap="1">
                <Text size="1" color="gray" weight="bold">{field.label}</Text>
              </Flex>
              <TextField.Root
                size="1"
                variant="soft"
                placeholder={`0 ${field.unit}`}
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={inventory[field.key] ?? 0}
                onChange={(e) => handleProductionChange(field.key, e.target.value)}
                className="tabular-nums"
              />
            </Grid>
          ))}
        </Flex>
      </Flex>
    </Card>
  );
};
