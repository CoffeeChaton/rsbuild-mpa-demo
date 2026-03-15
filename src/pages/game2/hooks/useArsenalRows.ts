// src/pages/game2/hooks/useArsenalRows.ts
import { useDeferredValue, useMemo } from "react";
import { calcArsenalRows } from "../core/calcArsenalRows";
import type { IInventory, IItem, IRowResult } from "../types";
import type { ILevelData } from "../core/data";

export const useArsenalRows = (
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
