import React, { memo, useCallback } from "react";
import { Checkbox, Table } from "@radix-ui/themes";
import type { IItem, IRowResult } from "../types";
import { StatCell } from "./TableRowItem/StatCell";
import { RowActions } from "./TableRowItem/RowActions";
import { RowInputs } from "./TableRowItem/RowInputs";

const areRowValuesEqual = (prev: IRowResult, next: IRowResult): boolean => (
	prev.costMoney === next.costMoney
	&& prev.costBooks === next.costBooks
	&& prev.cumMoney === next.cumMoney
	&& prev.cumBooks === next.cumBooks
	&& prev.moneyStatus === next.moneyStatus
	&& prev.booksStatus === next.booksStatus
	&& prev.status === next.status
);

const areItemValuesEqual = (prev: IItem, next: IItem): boolean => (
	prev.id === next.id
	&& prev.calculate === next.calculate
	&& prev.rarity === next.rarity
	&& prev.name === next.name
	&& prev.note === next.note
	&& prev.moduleFrom === next.moduleFrom
	&& prev.moduleTo === next.moduleTo
	&& prev.e1 === next.e1
	&& prev.l1 === next.l1
	&& prev.e2 === next.e2
	&& prev.l2 === next.l2
);

interface ITableRowItemProps {
	item: IItem;
	row: IRowResult;
	index: number;
	isLast: boolean;
	onUpdate: (id: string, field: keyof IItem, value: unknown) => void;
	onMove: (idx: number, delta: number) => void;
	onDelete: (id: string) => void;
}

const TableRowItemComponent: React.FC<ITableRowItemProps> = ({ item, row, index, isLast, onUpdate, onMove, onDelete }) => {
	const handleUpdate = useCallback(
		(field: keyof IItem, value: unknown) => {
			onUpdate(item.id, field, value);
		},
		[item.id, onUpdate],
	);

	return (
		<Table.Row
			align="center"
			style={{ transition: "background-color 0.1s ease" }}
		>
			<Table.Cell>
				<Checkbox
					checked={item.calculate}
					onCheckedChange={v => handleUpdate("calculate", !!v)}
				/>
			</Table.Cell>
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
			<Table.Cell>
				<RowActions
					index={index}
					isLast={isLast}
					itemId={item.id}
					onMove={onMove}
					onDelete={onDelete}
				/>
			</Table.Cell>
		</Table.Row>
	);
};

export const TableRowItem: React.FC<ITableRowItemProps> = memo(
	TableRowItemComponent,
	(prev, next) => (
		prev.index === next.index
		&& prev.isLast === next.isLast
		&& areItemValuesEqual(prev.item, next.item)
		&& areRowValuesEqual(prev.row, next.row)
	),
);
