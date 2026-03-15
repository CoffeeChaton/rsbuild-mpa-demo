// src/pages/game2/components/TableArea.tsx

import React, { useMemo } from "react";
import { Box, Button, Table } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { TableRowItem } from "./TableRowItem";
import { useTableItems } from "../hooks/useTableItems";
import type { IItem, IRowResult } from "../types";
import { TableHeader } from "./TableHeader";

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
}

export const TableArea: React.FC<ITableAreaProps> = ({
  rows,
  items,
  setItems,
}) => {
  const {
    updateItem,
    deleteItem,
    createItem,
    moveItem,
  } = useTableItems(setItems);

  const itemIndexMap = useMemo(() => {
    const map = new Map<string, { item: IItem, index: number }>();
    items.forEach((item, index) => map.set(item.id, { item, index }));
    return map;
  }, [items]);

  return (
    <Box
      className="border rounded-xl shadow-sm bg-white"
      style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "auto",
      }}
    >
      <Table.Root variant="surface">
        <TableHeader />

        <Table.Body>
          {rows.map((row) => {
            const entry = itemIndexMap.get(row.id);
            if (!entry) return null;

            const { item, index } = entry;
            return (
              <TableRowItem
                key={row.id}
                item={item}
                row={row}
                index={index}
                isLast={index === items.length - 1}
                onUpdate={updateItem}
                onMove={moveItem}
                onDelete={deleteItem}
              />
            );
          })}
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
