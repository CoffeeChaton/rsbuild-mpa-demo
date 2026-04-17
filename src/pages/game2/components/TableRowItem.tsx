import React, { useCallback, useMemo } from "react";
import { Checkbox, Flex, IconButton } from "@radix-ui/themes";
import { DragHandleDots2Icon, TrashIcon } from "@radix-ui/react-icons";
import type { IItem, IRowResult } from "../types";
import { StatCell } from "./TableRowItem/StatCell";
import { RowInputs } from "./TableRowItem/RowInputs";
import { TableCell, TableRow } from "@/src/components/ui/table";

// dnd-kit imports
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ITableRowItemProps {
	item: IItem;
	row: IRowResult;
	onUpdate: (id: string, field: keyof IItem, value: unknown) => void;
	onDelete: (id: string) => void;
}

const TableRowItemComponent: React.FC<ITableRowItemProps> = ({ item, row, onUpdate, onDelete }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: item.id });

	const handleUpdate = useCallback(
		(field: keyof IItem, value: unknown) => {
			onUpdate(item.id, field, value);
		},
		[item.id, onUpdate],
	);
	const handleCalculateChange = useCallback((checked: boolean | "indeterminate") => {
		handleUpdate("calculate", !!checked);
	}, [handleUpdate]);
	const handleDelete = useCallback(() => {
		onDelete(item.id);
	}, [item.id, onDelete]);

	const style = useMemo(() => ({
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 100 : "auto",
		position: "relative" as const,
		opacity: isDragging ? 0.5 : row.calculate ? 1 : 0.4,
		background: isDragging ? "var(--gray-2)" : "transparent",
	}), [isDragging, row.calculate, transform, transition]);

	return (
		<TableRow
			ref={setNodeRef}
			style={style}
			className={!row.calculate && !isDragging ? "grayscale" : ""}
		>
			<TableCell className="text-center">
				<Flex
					align="center"
					justify="center"
					{...attributes}
					{...listeners}
					className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
				>
					<DragHandleDots2Icon className="text-gray-400" />
				</Flex>
			</TableCell>
			<TableCell>
				<Checkbox
					checked={item.calculate}
					onCheckedChange={handleCalculateChange}
				/>
			</TableCell>
			{/* 中間計算區域 */}
			<RowInputs
				item={item}
				onUpdate={onUpdate}
			/>

			<StatCell value={row.costMoney} tone="money" variant="cost" />
			<StatCell value={row.costBooks} tone="books" variant="cost" />
			<StatCell value={row.cumMoney} tone="money" variant="cum" status={row.moneyStatus} showValue={item.calculate} />
			<StatCell value={row.cumBooks} tone="books" variant="cum" status={row.booksStatus} showValue={item.calculate} />

			{/* 尾部操作區域 */}
			<TableCell className="text-center">
				<IconButton size="1" variant="ghost" color="red" onClick={handleDelete} className="cursor-pointer">
					<TrashIcon />
				</IconButton>
			</TableCell>
		</TableRow>
	);
};

export const TableRowItem: React.FC<ITableRowItemProps> = TableRowItemComponent;
