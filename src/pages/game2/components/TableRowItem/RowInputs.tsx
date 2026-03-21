import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Text, TextField } from "@radix-ui/themes";
import type { IItem, IItemError } from "../../types";
import { RaritySelect } from "../RaritySelect";
import { validateItem } from "../../core/itemValidator";
import type { JSX } from "react/jsx-runtime";

interface IRowInputsProps {
	item: IItem;
	onUpdate: (id: string, field: keyof IItem, value: unknown) => void;
}

export const RowInputs: React.MemoExoticComponent<({ item, onUpdate }: IRowInputsProps) => JSX.Element> = React.memo(({ item, onUpdate }: IRowInputsProps) => {
	const [draft, setDraft] = useState(item);

	// 同步外部更新（避免不同步）
	useEffect(() => {
		setDraft(item);
	}, [item]);

	const handleUpdate = useCallback(
		(field: keyof IItem, value: unknown) => {
			setDraft((prev) => ({ ...prev, [field]: value }));
		},
		[],
	);

	// ✅ debounce commit（減少 render）
	useEffect(() => {
		const t = setTimeout(() => {
			Object.keys(draft).forEach((key) => {
				if (draft[key as keyof IItem] !== item[key as keyof IItem]) {
					onUpdate(item.id, key as keyof IItem, draft[key as keyof IItem]);
				}
			});
		}, 300); // 可調

		return () => clearTimeout(t);
	}, [draft, item, onUpdate]);

	// ✅ error 改成本地算（不卡）
	const error = useMemo(() => validateItem(draft), [draft]);

	// ---- input factory ----
	const renderField = (
		id: keyof IItem,
		w: number = 28,
		type: "text" | "number" = "number",
	) => (
		<TextField.Root
			type={type}
			size="1"
			style={{ width: w }}
			value={String(draft[id] ?? "")}
			variant={error.fields[id as keyof IItemError["fields"]]
				? "soft"
				: "surface"}
			color={error.fields[id as keyof IItemError["fields"]] ? "red" : undefined}
			onChange={(e) => handleUpdate(id, e.target.value)}
			onBlur={() => {
				// 🔥 保證 blur 一定同步（避免 debounce delay）
				onUpdate(item.id, id, draft[id]);
			}}
		/>
	);

	return (
		<>
			<Table.Cell width="28px">
				<RaritySelect
					value={draft.rarity}
					onValueChange={(val) => handleUpdate("rarity", Number(val))}
				/>
			</Table.Cell>

			<Table.Cell width="100px">{renderField("name", 120, "text")}</Table.Cell>
			<Table.Cell width="140px">{renderField("note", 160, "text")}</Table.Cell>

			{/* module */}
			<Table.Cell width="160px">
				<div style={{ display: "flex", width: 180, gap: 1 }}>
					{renderField("moduleFrom")}
					<Text size="1">→</Text>
					{renderField("moduleTo")}
				</div>
			</Table.Cell>

			{/* level */}
			<Table.Cell width="300px">
				<div style={{ display: "flex", width: 180, gap: 4 }}>
					{renderField("e1")}
					{renderField("l1", 32)}

					<Text size="1">→</Text>

					{renderField("e2")}
					{renderField("l2", 32)}
				</div>
			</Table.Cell>

			<Table.Cell width="200px">
				{error.messages.length > 0 && (
					<Text
						color="red"
						size="1"
						title={error.messages.join("\n")}
						className="cursor-help"
						style={{ width: 80 }}
					>
						⚠ {error.messages[0]} {error.messages.length > 1
							&& `(+${error.messages.length - 1})`}
					</Text>
				)}
			</Table.Cell>
		</>
	);
});
