import React, { memo, useCallback } from "react";
import { Checkbox, Flex, IconButton, Table, Text, TextField } from "@radix-ui/themes";
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "@radix-ui/react-icons";
import type { IItem, IRowResult, TRowStatus } from "../types";
import { RaritySelect } from "./RaritySelect";

const numStyle: React.CSSProperties = { whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", fontSize: "13px" };

const areRowValuesEqual = (prev: IRowResult, next: IRowResult): boolean => (
  prev.costMoney === next.costMoney
  && prev.costBooks === next.costBooks
  && prev.cumMoney === next.cumMoney
  && prev.cumBooks === next.cumBooks
  && prev.moneyStatus === next.moneyStatus
  && prev.booksStatus === next.booksStatus
  && prev.status === next.status
);

const areItemValuesEqual = (prev: IItem, next: IItem): boolean => (
  prev.id === next.id
  && prev.calculate === next.calculate
  && prev.rarity === next.rarity
  && prev.name === next.name
  && prev.note === next.note
  && prev.moduleFrom === next.moduleFrom
  && prev.moduleTo === next.moduleTo
  && prev.e1 === next.e1
  && prev.l1 === next.l1
  && prev.e2 === next.e2
  && prev.l2 === next.l2
);

type TStatTone = "money" | "books";
type TStatVariant = "cost" | "cum";

const toneColorMap: Record<TStatTone, React.ComponentProps<typeof Text>["color"]> = {
  money: "amber",
  books: "blue",
};

const cumStatusStyle: Record<TRowStatus, { backgroundColor: string; textColor: React.ComponentProps<typeof Text>["color"] }> = {
  safe: { backgroundColor: "var(--green-3)", textColor: "green" },
  danger: { backgroundColor: "var(--red-3)", textColor: "red" },
  disabled: { backgroundColor: "transparent", textColor: "gray" },
};

interface IStatCellProps {
  value: number;
  tone: TStatTone;
  variant: TStatVariant;
  status?: TRowStatus;
  showValue?: boolean;
}

const StatCell: React.FC<IStatCellProps> = memo(({ value, tone, variant, status, showValue = true }) => {
  if (!showValue) {
    return (
      <Table.Cell>
        <Text style={numStyle}>&nbsp;</Text>
      </Table.Cell>
    );
  }

  if (variant === "cost") {
    return (
      <Table.Cell>
        <Text weight="bold" color={toneColorMap[tone]} style={numStyle}>
          {value.toLocaleString()}
        </Text>
      </Table.Cell>
    );
  }

  const { backgroundColor, textColor } = cumStatusStyle[status ?? "safe"];
  return (
    <Table.Cell style={{ backgroundColor, transition: "background-color 0.15s ease" }}>
      <Text weight="bold" color={textColor} style={numStyle}>
        Σ {value.toLocaleString()}
      </Text>
    </Table.Cell>
  );
});
StatCell.displayName = "StatCell";

interface ITableRowItemProps {
  item: IItem;
  row: IRowResult;
  index: number;
  isLast: boolean;
  onUpdate: (id: string, field: keyof IItem, value: unknown) => void;
  onMove: (idx: number, delta: number) => void;
  onDelete: (id: string) => void;
}

const TableRowItemComponent: React.FC<ITableRowItemProps> = ({ item, row, index, isLast, onUpdate, onMove, onDelete }) => {
  const handleUpdate = useCallback(
    (field: keyof IItem, value: unknown) => {
      onUpdate(item.id, field, value);
    },
    [item.id, onUpdate],
  );

  const handleMoveUp = useCallback(() => onMove(index, -1), [index, onMove]);
  const handleMoveDown = useCallback(() => onMove(index, 1), [index, onMove]);
  const handleDelete = useCallback(() => onDelete(item.id), [item.id, onDelete]);

  return (
    <Table.Row
      align="center"
      style={{ transition: "background-color 0.1s ease" }}
    >
      <Table.Cell>
        <Checkbox
          checked={item.calculate}
          onCheckedChange={v => handleUpdate("calculate", !!v)}
        />
      </Table.Cell>
      <Table.Cell>
        {/* 選擇 星級 / 稀有度 */}
        <RaritySelect
          value={item.rarity}
          onValueChange={val => handleUpdate("rarity", Number(val))}
        />
      </Table.Cell>
      <Table.Cell>
        <TextField.Root
          size="1"
          value={item.name}
          onChange={e => handleUpdate("name", e.currentTarget.value)}
        />
      </Table.Cell>
      <Table.Cell>
        <TextField.Root
          size="1"
          variant="soft"
          value={item.note}
          onChange={e => handleUpdate("note", e.target.value)}
        />
      </Table.Cell>
      <Table.Cell>
        {/* 模組 */}
        <Flex align="center" gap="1">
          <TextField.Root type="number" size="1" style={{ width: 28 }} value={item.moduleFrom} onChange={e => handleUpdate("moduleFrom", e.target.value)} />
          <Text size="1" color="gray">→</Text>
          <TextField.Root type="number" size="1" style={{ width: 28 }} value={item.moduleTo} onChange={e => handleUpdate("moduleTo", e.target.value)} />
        </Flex>
      </Table.Cell>
      <Table.Cell>
        <Flex align="center" gap="1">
          <TextField.Root type="number" size="1" style={{ width: 28 }} value={item.e1} onChange={e => handleUpdate("e1", e.target.value)} />
          <TextField.Root type="number" size="1" style={{ width: 32 }} value={item.l1} onChange={e => handleUpdate("l1", e.target.value)} />
          <Text size="1" color="gray">→</Text>
          <TextField.Root type="number" size="1" style={{ width: 28 }} value={item.e2} onChange={e => handleUpdate("e2", e.target.value)} />
          <TextField.Root type="number" size="1" style={{ width: 32 }} value={item.l2} onChange={e => handleUpdate("l2", e.target.value)} />
        </Flex>
      </Table.Cell>
      <StatCell value={row.costMoney} tone="money" variant="cost" />
      <StatCell value={row.costBooks} tone="books" variant="cost" />
      <StatCell value={row.cumMoney} tone="money" variant="cum" status={row.moneyStatus} showValue={item.calculate} />
      <StatCell value={row.cumBooks} tone="books" variant="cum" status={row.booksStatus} showValue={item.calculate} />

      {/* 尾部操作區域 */}
      <Table.Cell>
        <Flex gap="1" justify="center">
          <IconButton size="1" variant="ghost" disabled={index === 0} onClick={handleMoveUp}>
            <ArrowUpIcon />
          </IconButton>
          <IconButton size="1" variant="ghost" disabled={isLast} onClick={handleMoveDown}>
            <ArrowDownIcon />
          </IconButton>
          <IconButton size="1" variant="ghost" color="red" onClick={handleDelete}>
            <TrashIcon />
          </IconButton>
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
};

// React.memo 包裝，避免無謂重渲染
export const TableRowItem = memo(
  TableRowItemComponent,
  (prev, next) => (
    prev.index === next.index
    && prev.isLast === next.isLast
    && areItemValuesEqual(prev.item, next.item)
    && areRowValuesEqual(prev.row, next.row)
  ),
);
