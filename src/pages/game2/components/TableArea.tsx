// src/pages/game2/components/TableArea.tsx

import React, { memo, useMemo } from "react";
import { Badge, Box, Button, Flex, Table } from "@radix-ui/themes";
import { CheckIcon, ClipboardCopyIcon, DownloadIcon } from "@radix-ui/react-icons";
import { TableRowItem } from "./TableRowItem";
import { useTableItems } from "../hooks/useTableItems";
import type { IItem } from "../types";
import { TableHeader } from "./TableHeader";
import { useArsenalActions, useArsenalItems, useArsenalRows } from "../context/ArsenalContext";
import { Plus } from "lucide-react";

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
	const { handleImport, handleExport, isCopied } = useArsenalActions();

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

			<Table.Root
				variant="surface"
				style={{
					display: "flex", // 關鍵：改為 flex 佈局
					flexDirection: "column",
					overflowY: "auto", // 允許縱向滾動
					height: "100%", // 撐滿剩餘空間
				}}
			>
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
					{/* 底部空白填充，確保能捲動超過最後一項 */}
					<Table.Row>
						<Table.Cell colSpan={11} style={{ border: "none", padding: 0 }}>
							<div style={{ height: "120px" }} className="flex items-center justify-center">
								<span className="text-[10px] text-muted-foreground/30 tracking-[0.3em] uppercase">
									— End of Planning —
								</span>
							</div>
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Box>
	);
});
