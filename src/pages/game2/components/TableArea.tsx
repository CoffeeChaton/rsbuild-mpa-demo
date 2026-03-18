// src/pages/game2/components/TableArea.tsx

import React, { memo, useMemo } from "react";
import { Box, Button, Table } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { TableRowItem } from "./TableRowItem";
import { useTableItems } from "../hooks/useTableItems";
import type { IItem } from "../types";
import { TableHeader } from "./TableHeader";
import { useArsenalItems, useArsenalRows } from "../context/ArsenalContext";

/**
 * TableArea
 *
 * 職責：
 * - 顯示角色需求表格
 */

export const TableArea: React.FC = memo(() => {
	const { items, setItems } = useArsenalItems();
	const { rows } = useArsenalRows();

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
			mt="4"
			className="shrink-0 overflow-hidden rounded-(--radius-4) border border-(--gray-5) bg-(--gray-1)"
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
});
