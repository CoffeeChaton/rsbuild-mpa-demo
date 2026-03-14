import React, { memo, useCallback, useMemo } from "react";
import { Checkbox, Flex, IconButton, Table, Text, TextField } from "@radix-ui/themes";
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "@radix-ui/react-icons";
import type { IItem, IRowResult, TRowStatus } from "../types";
import { RaritySelect } from "./RaritySelect";

const getRowStyle = (status: TRowStatus): React.CSSProperties => {
  // 基礎樣式（所有狀態共有）
  const style: React.CSSProperties = {
    transition: "all 0.1s ease",
  };

  // 處理 Disabled 狀態 (最優先，因為它會覆蓋其他屬性)
  if (status === "disabled") {
    return {
      ...style,
      backgroundColor: "var(--gray-2)",
      opacity: 0.5,
      color: "var(--gray-9)",
    };
  }

  // 處理活動中的狀態 (Safe / Danger)
  const isSafe = status === "safe";

  return {
    ...style,
    backgroundColor: isSafe ? "var(--green-3)" : "var(--red-2)",
    color: isSafe ? undefined : "var(--red-11)",
    boxShadow: `inset 4px 0 0 0 ${isSafe ? "var(--green-7)" : "var(--red-7)"}`,
    opacity: 1,
  };
};
const numStyle: React.CSSProperties = { whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", fontSize: "13px" };

interface ITableRowItemProps {
  row: IRowResult;
  index: number;
  isLast: boolean;
  onUpdate: (id: string, field: keyof IItem, value: unknown) => void;
  onMove: (idx: number, delta: number) => void;
  onDelete: (id: string) => void;
}

const TableRowItemComponent: React.FC<ITableRowItemProps> = ({ row, index, isLast, onUpdate, onMove, onDelete }) => {
  const rowStyle = useMemo(() => getRowStyle(row.status), [row.status]);

  const handleUpdate = useCallback(
    (field: keyof IItem, value: unknown) => {
      onUpdate(row.id, field, value);
    },
    [row.id, onUpdate],
  );

  const handleMoveUp = useCallback(() => onMove(index, -1), [index, onMove]);
  const handleMoveDown = useCallback(() => onMove(index, 1), [index, onMove]);
  const handleDelete = useCallback(() => onDelete(row.id), [row.id, onDelete]);

  return (
    <Table.Row
      align="center"
      style={rowStyle}
    >
      <Table.Cell>
        <Checkbox
          checked={row.calculate}
          onCheckedChange={v => handleUpdate("calculate", !!v)}
        />
      </Table.Cell>
      <Table.Cell>
        {/* 選擇 星級 / 稀有度 */}
        <RaritySelect
          value={row.rarity}
          onValueChange={val => handleUpdate("rarity", Number(val))}
        />
      </Table.Cell>
      <Table.Cell>
        <TextField.Root
          size="1"
          value={row.name}
          onChange={e => handleUpdate("name", e.currentTarget.value)}
        />
      </Table.Cell>
      <Table.Cell>
        <TextField.Root
          size="1"
          variant="soft"
          value={row.note}
          onChange={e => handleUpdate("note", e.target.value)}
        />
      </Table.Cell>
      <Table.Cell>
        {/* 模組 */}
        <Flex align="center" gap="1">
          <TextField.Root type="number" size="1" style={{ width: 28 }} value={row.moduleFrom} onChange={e => handleUpdate("moduleFrom", Number(e.target.value))} />
          <Text size="1" color="gray">→</Text>
          <TextField.Root type="number" size="1" style={{ width: 28 }} value={row.moduleTo} onChange={e => handleUpdate("moduleTo",  Number(e.target.value))} />
        </Flex>
      </Table.Cell>
      <Table.Cell>
        <Flex align="center" gap="1">
          <TextField.Root type="number" size="1" style={{ width: 28 }} value={row.e1} onChange={e => handleUpdate("e1", Number(e.target.value))} />
          <TextField.Root type="number" size="1" style={{ width: 32 }} value={row.l1} onChange={e => handleUpdate("l1", Number(e.target.value))} />
          <Text size="1" color="gray">→</Text>
          <TextField.Root type="number" size="1" style={{ width: 28 }} value={row.e2} onChange={e => handleUpdate("e2", Number(e.target.value))} />
          <TextField.Root type="number" size="1" style={{ width: 32 }} value={row.l2} onChange={e => handleUpdate("l2", Number(e.target.value))} />
        </Flex>
      </Table.Cell>
      <Table.Cell>
        <Text weight="bold" color="amber" style={numStyle}>{row.costMoney.toLocaleString()}</Text>
      </Table.Cell>
      <Table.Cell>
        <Text weight="bold" color="blue" style={numStyle}>{row.costBooks.toLocaleString()}</Text>
      </Table.Cell>
      <Table.Cell>
        <Text weight="bold" style={numStyle}>Σ {row.cumMoney.toLocaleString()}</Text>
      </Table.Cell>
      <Table.Cell>
        <Text weight="bold" style={numStyle}>Σ {row.cumBooks.toLocaleString()}</Text>
      </Table.Cell>

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
export const TableRowItem = memo(TableRowItemComponent, (prev, next) => prev.row === next.row && prev.isLast === next.isLast);
