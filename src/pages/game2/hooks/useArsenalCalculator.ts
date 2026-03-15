// src/pages/game2/hooks/useArsenalCalculator.ts
import { useArsenalStorage } from "./useArsenalStorage";
import { useLevelData } from "./useLevelData";
import { useArsenalRows } from "./useArsenalRows";
import { useArsenalTSV } from "./useArsenalTSV";
import type { Dispatch, SetStateAction } from "react";
import type { IInventory, IItem, IRowResult } from "../types";

export type TArsenalCalculator = {
	items: IItem[],
	setItems: Dispatch<SetStateAction<IItem[]>>,
	inventory: IInventory,
	setInventory: Dispatch<SetStateAction<IInventory>>,
	rows: IRowResult[],
	handleImport: () => Promise<void>,
	handleExport: () => void,
	levelDataLoading: boolean,
	levelDataError: unknown,
};

export const useArsenalCalculator = (): TArsenalCalculator => {
	const { items, setItems, inventory, setInventory } = useArsenalStorage();
	const { levelData, levelDataLoading, levelDataError } = useLevelData();
	const rows = useArsenalRows(items, inventory, levelData);
	const { handleImport, handleExport } = useArsenalTSV(setItems, rows);

	return {
		items,
		setItems,
		inventory,
		setInventory,
		rows,
		handleImport,
		handleExport,
		levelDataLoading,
		levelDataError,
	};
};
