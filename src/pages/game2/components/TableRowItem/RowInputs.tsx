import React, { useCallback } from "react";
import { Flex, Table, Text, TextField } from "@radix-ui/themes";
import type { IItem } from "../../types";
import { RaritySelect } from "../RaritySelect";

interface IRowInputsProps {
	item: IItem;
	onUpdate: (id: string, field: keyof IItem, value: unknown) => void;
}

const RowInputsComponent: React.FC<IRowInputsProps> = ({
	item,
	onUpdate,
}) => {
	const handleUpdate = useCallback(
		(field: keyof IItem, value: unknown) => {
			onUpdate(item.id, field, value);
		},
		[item.id, onUpdate],
	);
	return (
		<>
			<Table.Cell>
				{/* 選擇 星級 / 稀有度 */}
				<RaritySelect
					value={item.rarity}
					onValueChange={val => handleUpdate("rarity", Number(val))}
				/>
			</Table.Cell>
			<Table.Cell>
				<TextField.Root
					size="1"
					value={item.name}
					onChange={e => handleUpdate("name", e.currentTarget.value)}
				/>
			</Table.Cell>
			<Table.Cell>
				<TextField.Root
					size="1"
					variant="soft"
					value={item.note}
					onChange={e => handleUpdate("note", e.target.value)}
				/>
			</Table.Cell>
			<Table.Cell>
				{/* 模組 */}
				<Flex align="center" gap="1">
					<TextField.Root type="number" size="1" style={{ width: 28 }} value={item.moduleFrom} onChange={e => handleUpdate("moduleFrom", e.target.value)} />
					<Text size="1" color="gray">→</Text>
					<TextField.Root type="number" size="1" style={{ width: 28 }} value={item.moduleTo} onChange={e => handleUpdate("moduleTo", e.target.value)} />
				</Flex>
			</Table.Cell>
			<Table.Cell>
				<Flex align="center" gap="1">
					<TextField.Root type="number" size="1" style={{ width: 28 }} value={item.e1} onChange={e => handleUpdate("e1", e.target.value)} />
					<TextField.Root type="number" size="1" style={{ width: 32 }} value={item.l1} onChange={e => handleUpdate("l1", e.target.value)} />
					<Text size="1" color="gray">→</Text>
					<TextField.Root type="number" size="1" style={{ width: 28 }} value={item.e2} onChange={e => handleUpdate("e2", e.target.value)} />
					<TextField.Root type="number" size="1" style={{ width: 32 }} value={item.l2} onChange={e => handleUpdate("l2", e.target.value)} />
				</Flex>
			</Table.Cell>
		</>
	);
};

export const RowInputs: React.NamedExoticComponent<IRowInputsProps> = React.memo(RowInputsComponent);
