import { useCallback } from "react";
import type { IInventory } from "../types";
import { calculateBookStacksValue, type IBookStacks, sanitizeBookStacks } from "../config/inventory";

const clampPositiveNumber = (value: string) => {
	const n = Number(value);
	return Number.isFinite(n) && n >= 0 ? n : 0;
};

type ProductionFieldKey = "avgMoneyProduction" | "avgBookProduction";

export type TUseInventory = (inventory: IInventory, onUpdate: (update: Partial<IInventory>) => void) => {
	handleStackChange: (index: number, value: string) => void,
	handleProductionChange: (key: ProductionFieldKey, value: string) => void,
	handleClipboardExport: () => Promise<void>,
	handleClipboardImport: () => Promise<void>,
};

export const useInventory: TUseInventory = (
	inventory,
	onUpdate,
) => {
	const handleStackChange = useCallback(
		(index: number, value: string) => {
			const num = clampPositiveNumber(value);
			const nextStacks: IBookStacks = [...inventory.bookStacks] as IBookStacks;
			nextStacks[index] = num;
			const sanitized = sanitizeBookStacks(nextStacks);
			onUpdate({ bookStacks: sanitized, books: calculateBookStacksValue(sanitized) });
		},
		[inventory.bookStacks, onUpdate],
	);

	const handleProductionChange = useCallback(
		(key: ProductionFieldKey, value: string) => {
			const num = clampPositiveNumber(value);
			onUpdate({ [key]: num });
		},
		[onUpdate],
	);

	const handleClipboardExport = useCallback(async () => {
		const payload = JSON.stringify(inventory, null, 2);
		await navigator.clipboard.writeText(payload);
	}, [inventory]);

	const handleClipboardImport = useCallback(async () => {
		const text = await navigator.clipboard.readText();

		try {
			const parsed = JSON.parse(text) as Partial<IInventory>;
			onUpdate(parsed);
		} catch {
			console.warn("Clipboard parse failed");
		}
	}, [onUpdate]);

	return {
		handleStackChange,
		handleProductionChange,
		handleClipboardExport,
		handleClipboardImport,
	};
};
