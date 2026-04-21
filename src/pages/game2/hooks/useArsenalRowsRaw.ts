import type { ILevelData } from "../core/data";
import type { IInventory } from "../types/inventory";
import type { IItem } from "../types/item";
import type { IRowResult } from "../types/rowResult";
// src/pages/game2/hooks/useArsenalRowsRaw.ts
import { useDeferredValue, useMemo } from "react";
import { calcArsenalRows } from "../core/calcArsenalRows";

export const useArsenalRowsRaw = (
	items: IItem[],
	inventory: IInventory,
	levelData?: ILevelData,
): IRowResult[] => {
	const deferredItems = useDeferredValue(items);
	const deferredInventory = useDeferredValue(inventory);

	return useMemo(() => {
		if (!levelData) return [];
		return calcArsenalRows(deferredItems, deferredInventory, levelData);
	}, [deferredItems, deferredInventory, levelData]);
};
