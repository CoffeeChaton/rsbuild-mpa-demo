// src/pages/game2/components/TableArea.tsx

import React from "react";
import { Box, Button, Table } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { TableRowItem } from "./TableRowItem";
import { useTableItems } from "../hooks/useTableItems";
import type { IItem, IRowResult } from "../types";

/**
 * TableArea
 *
 * 職責：
 * - 顯示角色需求表格
 * - 行編輯
 * - 行移動
 * - 行刪除
 * - 新增行
 */

interface ITableAreaProps {
  rows: IRowResult[];
  items: IItem[];
  setItems: React.Dispatch<React.SetStateAction<IItem[]>>;
  onMove: (idx: number, delta: number) => void;
}

export const TableArea: React.FC<ITableAreaProps> = ({
  rows,
  items,
  setItems,
  onMove,
}) => {
  const {
    updateItem,
    deleteItem,
    createItem,
  } = useTableItems(items, setItems);

  return (
    <Box
      className="border rounded-xl shadow-sm bg-white"
      style={{
        flex: 1,
        overflowY: "scroll",
        overflowX: "auto",
      }}
    >
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell width="28px">星級</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell minWidth="100px">角色</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell minWidth="140px">備註</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>模組</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>等級提升</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell width="100px">預估錢</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell width="100px">預估書</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell width="130px">累計錢</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell width="130px">累計書</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell width="120px" align="center">操作</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {rows.map((row, idx) => (
            <TableRowItem
              key={row.id}
              row={row}
              index={idx}
              isLast={idx === items.length - 1}
              onUpdate={updateItem}
              onMove={onMove}
              onDelete={deleteItem}
            />
          ))}
        </Table.Body>
      </Table.Root>

      <Box p="2">
        <Button
          variant="ghost"
          size="3"
          onClick={createItem}
        >
          <PlusIcon /> 新增需求列
        </Button>
      </Box>
    </Box>
  );
};
