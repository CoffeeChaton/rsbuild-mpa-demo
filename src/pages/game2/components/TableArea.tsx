// src/pages/game2/components/TableArea.tsx

import React, { memo, useCallback, useMemo } from "react";
import { Badge, Box, Button, Flex, Table } from "@radix-ui/themes";
import { CheckIcon, ClipboardCopyIcon, DownloadIcon } from "@radix-ui/react-icons";
import { TableRowItem } from "./TableRowItem";
import { useTableItems } from "../hooks/useTableItems";
import type { IItem } from "../types";
import { TableHeader } from "./TableHeader";
import { useArsenalActions, useArsenalItems, useArsenalRows } from "../context/ArsenalContext";
import { Plus } from "lucide-react";

// dnd-kit imports
import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export const TableArea: React.FC = memo(() => {
	const { items, setItems } = useArsenalItems();
	const { rows } = useArsenalRows();

	const {
		updateItem,
		deleteItem,
		createItem,
	} = useTableItems(setItems);
	const { handleImport, handleExport, isCopied } = useArsenalActions();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			setItems((prevItems) => {
				const oldIndex = prevItems.findIndex((item) => item.id === active.id);
				const newIndex = prevItems.findIndex((item) => item.id === over.id);
				return arrayMove(prevItems, oldIndex, newIndex);
			});
		}
	}, [setItems]);

	const itemIndexMap = useMemo(() => {
		const map = new Map<string, { item: IItem, index: number }>();
		items.forEach((item, index) => map.set(item.id, { item, index }));
		return map;
	}, [items]);

	return (
		<Box className="flex flex-col h-full overflow-hidden rounded-(--radius-4) border border-(--gray-5) bg-(--gray-1)">
			<div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30 shrink-0">
				<div className="flex items-center gap-3">
					<h2 className="text-sm font-semibold uppercase tracking-wider">
						練度規劃列表
					</h2>
					<Badge className="font-mono text-xs">
						{rows.length} 筆
					</Badge>
				</div>
				{/* Save Slot Section */}
				<Flex direction="column" gap="3">
					<Flex gap="2">
						<Button
							size="1"
							variant="outline"
							onClick={handleImport}
						>
							<DownloadIcon /> 從剪貼簿導入
						</Button>

						<Button
							size="1"
							variant={isCopied ? "solid" : "outline"}
							onClick={handleExport}
						>
							{isCopied ? <CheckIcon /> : <ClipboardCopyIcon />}
							{isCopied ? "已複製" : "導出 TSV"}
						</Button>

						<Button onClick={createItem} size="1" className="gap-1.5">
							<Plus className="h-3.5 w-3.5" />
							新增需求列
						</Button>
					</Flex>
				</Flex>
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<Table.Root
					variant="surface"
					style={{
						display: "flex",
						flexDirection: "column",
						overflowY: "auto",
						height: "100%",
					}}
				>
					<TableHeader />
					<Table.Body>
						<SortableContext
							items={items.map(item => item.id)}
							strategy={verticalListSortingStrategy}
						>
							{rows.map((row) => {
								const entry = itemIndexMap.get(row.id);
								if (!entry) return null;

								const { item } = entry;
								return (
									<TableRowItem
										key={row.id}
										item={item}
										row={row}
										onUpdate={updateItem}
										onDelete={deleteItem}
									/>
								);
							})}
						</SortableContext>
						{/* 底部空白填充 */}
						<Table.Row>
							<Table.Cell style={{ boxShadow: "none" }}>
							</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell colSpan={11} style={{ border: "none", padding: 0 }}>
								<div className="flex items-center justify-center">
									<span className="text-[10px] text-muted-foreground/30 tracking-[0.3em] uppercase">
										— End of Planning —
									</span>
								</div>
							</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
			</DndContext>
		</Box>
	);
});
