// src/pages/game2/hooks/useArsenalStorage.ts
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { STORAGE_KEY } from "../config/constants";
import type { IInventory, IItem } from "../types";
import { sanitizeBookStacks } from "../config/inventory";

const toPositiveNumber = (value: unknown) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
};

const createInventoryState = (inv?: Partial<IInventory>): IInventory => ({
	money: toPositiveNumber(inv?.money),
	books: toPositiveNumber(inv?.books),
	bookStacks: sanitizeBookStacks(inv?.bookStacks),
	avgMoneyProduction: toPositiveNumber(inv?.avgMoneyProduction),
	avgBookProduction: toPositiveNumber(inv?.avgBookProduction),
});

export const useArsenalStorage = (): {
	items: IItem[],
	setItems: Dispatch<SetStateAction<IItem[]>>,
	inventory: IInventory,
	setInventory: Dispatch<SetStateAction<IInventory>>,
} => {
	const [items, setItems] = useState<IItem[]>(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (!saved) return [];
		try {
			const parsed = JSON.parse(saved);
			return Array.isArray(parsed.items) ? parsed.items : [];
		} catch {
			return [];
		}
	});

	const [inventory, setInventory] = useState<IInventory>(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (!saved) return createInventoryState();
		try {
			const parsed = JSON.parse(saved);
			return parsed.inv ? createInventoryState(parsed.inv) : createInventoryState();
		} catch {
			return createInventoryState();
		}
	});

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, inv: inventory }));
	}, [items, inventory]);

	return { items, setItems, inventory, setInventory };
};
