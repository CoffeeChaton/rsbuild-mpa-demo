// src/pages/game2/hooks/useInventory.ts
import { useCallback } from "react";
import type { IInventory } from "../types";
import { type IBookStacks, sanitizeBookStacks } from "../config/inventory";

const clampPositiveNumber = (value: string) => {
	const n = Number(value);
	return Number.isFinite(n) && n >= 0 ? n : 0;
};

type ProductionFieldKey = "avgMoneyProduction" | "avgBookProduction";

export type TUseInventory = (inventory: IInventory, onUpdate: (update: Partial<IInventory>) => void) => {
	handleStackChange: (key: keyof IBookStacks, value: string) => void,
	handleProductionChange: (key: ProductionFieldKey, value: string) => void,
};

export const useInventory: TUseInventory = (
	inventory,
	onUpdate,
) => {
	const handleStackChange = useCallback(
		(key: keyof IBookStacks, value: string) => {
			// 1. 數值清洗 (確保大於等於 0)
			const num = clampPositiveNumber(value);

			// 2. 建立新的物件引用 (不可變更新)
			const nextStacks: IBookStacks = {
				...inventory.bookStacks,
				[key]: num,
			};

			// 3. 進行數據校驗與計算總值
			const sanitized = sanitizeBookStacks(nextStacks);

			onUpdate({
				bookStacks: sanitized,
			});
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

	return {
		handleStackChange,
		handleProductionChange,
	};
};
