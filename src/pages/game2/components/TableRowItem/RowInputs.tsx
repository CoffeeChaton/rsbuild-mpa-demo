import type { IItem } from "../../types/item";
import { Flex, Text } from "@radix-ui/themes";
import * as React from "react";
import { memo, useCallback, useMemo } from "react";
import { TableCell } from "@/src/components/ui/table";
import { validateItem } from "../../core/itemValidator";
import { RaritySelect } from "../RaritySelect";
import { CellWithError } from "./CellWithError";
import { TableInput } from "./TableInput";

interface IRowInputsProps {
	item: IItem;
	onUpdate: (id: string, field: keyof IItem, value: unknown) => void;
}

export const RowInputs: React.MemoExoticComponent<({ item, onUpdate }: IRowInputsProps) => React.JSX.Element> = memo(({ item, onUpdate }: IRowInputsProps) => {
	const error = useMemo(() => validateItem(item), [item]);

	const handleUpdate = useCallback(
		(field: keyof IItem, value: unknown) => onUpdate(item.id, field, value),
		[item.id, onUpdate],
	);
	const handleRarityChange = useCallback((value: number) => {
		handleUpdate("rarity", value);
	}, [handleUpdate]);
	const nameErrors = useMemo(() => [error.fields.name], [error.fields.name]);
	const noteErrors = useMemo(() => [error.fields.note], [error.fields.note]);
	const moduleErrors = useMemo(() => [error.fields.moduleFrom, error.fields.moduleTo], [error.fields.moduleFrom, error.fields.moduleTo]);
	const levelErrors = useMemo(
		() => [error.fields.e1, error.fields.l1, error.fields.e2, error.fields.l2, error.fields.progress],
		[error.fields.e1, error.fields.l1, error.fields.e2, error.fields.l2, error.fields.progress],
	);

	return (
		<>
			<TableCell className="text-center p-2">
				<RaritySelect
					value={item.rarity}
					onValueChange={handleRarityChange}
				/>
			</TableCell>

			{/* 角色名稱 */}
			<CellWithError errorMessages={nameErrors}>
				<TableInput
					id="name"
					type="text"
					width={100}
					value={item.name}
					errorMessage={error.fields.name}
					onChange={handleUpdate}
				/>
			</CellWithError>

			{/* 備註 */}
			<CellWithError errorMessages={noteErrors}>
				<TableInput
					id="note"
					type="text"
					width={160}
					value={item.note}
					errorMessage={error.fields.note}
					onChange={handleUpdate}
				/>
			</CellWithError>

			{/* 模組進度 */}
			<CellWithError errorMessages={moduleErrors}>
				<TableInput
					id="moduleFrom"
					width={40}
					value={item.moduleFrom}
					errorMessage={error.fields.moduleFrom}
					onChange={handleUpdate}
				/>
				<Text size="1" color="gray" weight="bold">→</Text>
				<TableInput
					id="moduleTo"
					width={40}
					value={item.moduleTo}
					errorMessage={error.fields.moduleTo}
					onChange={handleUpdate}
				/>
			</CellWithError>

			{/* 等級進度 */}
			<CellWithError errorMessages={levelErrors}>
				<Flex gap="1">
					<TableInput id="e1" width={40} value={item.e1} errorMessage={error.fields.e1} onChange={handleUpdate} />
					<TableInput id="l1" width={40} value={item.l1} errorMessage={error.fields.l1} onChange={handleUpdate} />
				</Flex>
				<Text size="1" color="gray" weight="bold">→</Text>
				<Flex gap="1">
					<TableInput id="e2" width={40} value={item.e2} errorMessage={error.fields.e2} onChange={handleUpdate} />
					<TableInput id="l2" width={40} value={item.l2} errorMessage={error.fields.l2} onChange={handleUpdate} />
				</Flex>
			</CellWithError>
		</>
	);
});
