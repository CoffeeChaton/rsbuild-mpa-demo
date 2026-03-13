import React from "react";
import { Checkbox, Flex, IconButton, Table, Text, TextField } from "@radix-ui/themes";
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "@radix-ui/react-icons";
import type { IItem, IRowResult } from "../types";

interface ITableRowItemProps {
  row: IRowResult;
  index: number;
  isLast: boolean;
  onUpdate: (id: string, field: keyof IItem, value: unknown) => void;
  onMove: (idx: number, delta: number) => void;
  onDelete: (id: string) => void;
}

export const TableRowItem: React.FC<ITableRowItemProps> = ({
  row,
  index,
  isLast,
  onUpdate,
  onMove,
  onDelete,
}) => {
  const bgColor = row.status === "disabled" ? "#f9f9f9" : row.status === "safe" ? "#f2fcf5" : "#fff5f5";
  const numStyle: React.CSSProperties = { whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", fontSize: "13px" };

  return (
    <Table.Row align="center" style={{ backgroundColor: bgColor }}>
      <Table.Cell>
        <Checkbox
          checked={row.calculate}
          onCheckedChange={(v) => onUpdate(row.id, "calculate", !!v)}
        />
      </Table.Cell>
      <Table.Cell>
        <TextField.Root
          type="number"
          size="1"
          style={{ width: 32 }}
          value={row.rarity}
          onChange={e => onUpdate(row.id, "rarity", Number(e.target.value))}
        />
      </Table.Cell>
      <Table.Cell>
        <TextField.Root size="1" value={row.name} onChange={e => onUpdate(row.id, "name", e.target.value)} />
      </Table.Cell>
      <Table.Cell>
        <TextField.Root size="1" variant="soft" value={row.note} onChange={e => onUpdate(row.id, "note", e.target.value)} />
      </Table.Cell>
      <Table.Cell>
        <Flex align="center" gap="1">
          <TextField.Root size="1" style={{ width: 40 }} value={row.moduleFrom} onChange={e => onUpdate(row.id, "moduleFrom", e.target.value)} />
          <Text size="1">→</Text>
          <TextField.Root size="1" style={{ width: 40 }} value={row.moduleTo} onChange={e => onUpdate(row.id, "moduleTo", e.target.value)} />
        </Flex>
      </Table.Cell>
      <Table.Cell>
        <Flex align="center" gap="1">
          <TextField.Root type="number" size="1" style={{ width: 32 }} value={row.e1} onChange={e => onUpdate(row.id, "e1", Number(e.target.value))} />
          <TextField.Root type="number" size="1" style={{ width: 42 }} value={row.l1} onChange={e => onUpdate(row.id, "l1", Number(e.target.value))} />
          <Text size="1">→</Text>
          <TextField.Root type="number" size="1" style={{ width: 32 }} value={row.e2} onChange={e => onUpdate(row.id, "e2", Number(e.target.value))} />
          <TextField.Root type="number" size="1" style={{ width: 42 }} value={row.l2} onChange={e => onUpdate(row.id, "l2", Number(e.target.value))} />
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
        <Text color="gray" style={numStyle}>Σ {row.cumBooks.toLocaleString()}</Text>
      </Table.Cell>
      <Table.Cell>
        <Flex gap="1" justify="center">
          <IconButton size="1" variant="ghost" disabled={index === 0} onClick={() => onMove(index, -1)}>
            <ArrowUpIcon />
          </IconButton>
          <IconButton size="1" variant="ghost" disabled={isLast} onClick={() => onMove(index, 1)}>
            <ArrowDownIcon />
          </IconButton>
          <IconButton size="1" variant="ghost" color="red" onClick={() => onDelete(row.id)}>
            <TrashIcon />
          </IconButton>
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
};
