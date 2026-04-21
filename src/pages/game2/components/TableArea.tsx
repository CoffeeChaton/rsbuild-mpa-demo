import type { IItem } from "../types/item";
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
import { CheckIcon, ClipboardCopyIcon, DownloadIcon } from "@radix-ui/react-icons";
import { Badge, Button, Flex } from "@radix-ui/themes";
import { Plus } from "lucide-react";
import React, { memo, useCallback, useMemo } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/src/components/ui/table";
import { useArsenalActions, useArsenalItems, useArsenalRows } from "../context/ArsenalContext";
import { useTableItems } from "../hooks/useTableItems";
import { TableHeader } from "./TableHeader";
import { TableRowItem } from "./TableRowItem";

/**
 * TableArea
 *
 * 布局策略：
 * - PC 滿版：min-w-[1600px] 確保顯示。
 * - 透過 Tailwind 媒體查詢處理不同 Breakpoint 下的滾動行為。
 */

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
	const sortableItemIds = useMemo(() => items.map(item => item.id), [items]);

	return (
		<div className="flex flex-col h-full w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
			{/* 工具列 */}
			<div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
				<div className="flex items-center gap-3 shrink-0">
					<h2 className="text-sm font-bold uppercase tracking-wider">
						練度規劃列表
					</h2>
					<Badge className="font-mono text-xs">
						{rows.length} 筆
					</Badge>
				</div>
				<Flex gap="2" wrap="wrap" justify="end">
					<Button
						size="1"
						variant="outline"
						color="indigo"
						onClick={handleImport}
					>
						<DownloadIcon /> 從剪貼簿導入
					</Button>

					<Button
						size="1"
						variant={isCopied ? "solid" : "outline"}
						color={isCopied ? "green" : "indigo"}
						onClick={handleExport}
					>
						{isCopied ? <CheckIcon /> : <ClipboardCopyIcon />}
						{isCopied ? "已複製" : "導出 TSV"}
					</Button>

					<Button onClick={createItem} size="1" variant="outline" color="indigo" className="gap-1.5 cursor-pointer">
						<Plus className="h-3.5 w-3.5" />
						新增需求列
					</Button>
				</Flex>
			</div>

			{/* 表格區域 */}
			<div className="flex-1 min-h-0 w-full">
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<Table
						fixed
						containerClassName="h-full w-full rounded-none border-0"
						className="min-w-400"
					>
						<TableHeader />
						<TableBody>
							<SortableContext
								items={sortableItemIds}
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

							<TableRow className="hover:bg-transparent border-none">
								<TableCell colSpan={12} className="p-0 border-none">
									<div className="flex h-40 items-center justify-center opacity-30 select-none">
										<span className="text-[10px] tracking-[0.5em] uppercase">
											— Arknights Planner End —
										</span>
									</div>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</DndContext>
			</div>
		</div>
	);
});
