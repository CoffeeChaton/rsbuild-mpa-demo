// src/pages/game2/components/TableArea.tsx

import React from "react";
import { Box, Button, Table } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { TableRowItem } from "./TableRowItem";
import type { IItem, IRowResult } from "../type";

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
          {rows.map((row, idx) => (
            <TableRowItem
              key={row.id}
              row={row}
              index={idx}
              isLast={idx === items.length - 1}
              onUpdate={(id, f, v) =>
                setItems(prev =>
                  prev.map(i =>
                    i.id === id
                      ? { ...i, [f]: v }
                      : i
                  )
                )}
              onMove={onMove}
              onDelete={(id) => setItems(prev => prev.filter(i => i.id !== id))}
            />
          ))}
        </Table.Body>
      </Table.Root>

      <Box p="2">
        <Button
          variant="ghost"
          size="3"
          onClick={() =>
            setItems([
              ...items,
              {
                id: crypto.randomUUID(),
                calculate: true,
                name: "",
                note: "",
                moduleFrom: "0",
                moduleTo: "3",
                e1: 0,
                l1: 1,
                e2: 2,
                l2: 1,
              },
            ])}
        >
          <PlusIcon /> 新增需求項目
        </Button>
      </Box>
    </Box>
  );
};
