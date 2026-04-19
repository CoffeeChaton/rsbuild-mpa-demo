// src/pages/game2/hooks/useArsenalStorage.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { STORAGE_KEY } from "../config/constants";
import type { IInventory, IItem } from "../types";
import { sanitizeBookStacks } from "../core/calculateBookStacksValue";

const createInventoryState = (inv?: Partial<IInventory>): IInventory => ({
	money: Number(inv?.money) || 0,
	bookStacks: sanitizeBookStacks(inv?.bookStacks),
	avgMoneyProduction: Number(inv?.avgMoneyProduction) || 0,
	avgBookProduction: Number(inv?.avgBookProduction) || 0,
});

interface IArsenalData {
	items: IItem[];
	inv: IInventory;
}

const arsenalDataFetcher = (key: string): IArsenalData => {
	const saved = localStorage.getItem(key);
	try {
		const parsed = saved ? JSON.parse(saved) : {};
		return {
			items: Array.isArray(parsed.items) ? parsed.items : [],
			inv: parsed.inv ? createInventoryState(parsed.inv) : createInventoryState(),
		};
	} catch {
		return { items: [], inv: createInventoryState() };
	}
};

export type TUseArsenalStorage = (configId: string) => {
	items: IItem[],
	setItems: (value: IItem[] | ((prev: IItem[]) => IItem[])) => void,
	inventory: IInventory,
	setInventory: (value: IInventory | ((prev: IInventory) => IInventory)) => void,
};

export const useArsenalStorage: TUseArsenalStorage = (configId) => {
	const dataKey = useMemo(() => configId === "default" ? STORAGE_KEY : `${STORAGE_KEY}_data_${configId}`, [configId]);
	const initialData = useMemo(() => arsenalDataFetcher(dataKey), [dataKey]);
	const [items, setItems] = useState<IItem[]>(initialData.items);
	const [inventory, setInventory] = useState<IInventory>(initialData.inv);

	useEffect(() => {
		localStorage.setItem(dataKey, JSON.stringify({ items, inv: inventory }));
	}, [dataKey, items, inventory]);

	const updateItems = useCallback((value: IItem[] | ((prev: IItem[]) => IItem[])): void => {
		setItems((prev) => typeof value === "function" ? value(prev) : value);
	}, []);

	const updateInventory = useCallback((value: IInventory | ((prev: IInventory) => IInventory)): void => {
		setInventory((prev) => typeof value === "function" ? value(prev) : value);
	}, []);

	return { items, setItems: updateItems, inventory, setInventory: updateInventory };
};
