// src/pages/game2/hooks/useArsenalStorage.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import * as v from "valibot";
import { STORAGE_KEY } from "../config/constants";
import type { IInventory, IItem } from "../types";
import { sanitizeBookStacks } from "../core/calculateBookStacksValue";
import { StoredItemSchema, toItem } from "../types/item";

interface IInventoryStateInput {
	money?: number | undefined;
	bookStacks?: IInventory["bookStacks"] | undefined;
	avgMoneyProduction?: number | undefined;
	avgBookProduction?: number | undefined;
}

const createInventoryState = (inv?: IInventoryStateInput): IInventory => ({
	money: Number(inv?.money) || 0,
	bookStacks: sanitizeBookStacks(inv?.bookStacks),
	avgMoneyProduction: Number(inv?.avgMoneyProduction) || 0,
	avgBookProduction: Number(inv?.avgBookProduction) || 0,
});

interface IArsenalData {
	items: IItem[];
	inv: IInventory;
}

const BookStacksSchema = v.object({
	advanced: v.number(),
	intermediate: v.number(),
	primary: v.number(),
	basic: v.number(),
});

const InventorySchema = v.object({
	money: v.number(),
	bookStacks: BookStacksSchema,
	avgMoneyProduction: v.number(),
	avgBookProduction: v.number(),
});

const ArsenalDataSchema = v.object({
	items: v.array(StoredItemSchema),
	inv: v.optional(v.partial(InventorySchema)),
});

const arsenalDataFetcher = (key: string): IArsenalData => {
	const saved = localStorage.getItem(key);
	try {
		const parsed = saved ? v.parse(ArsenalDataSchema, JSON.parse(saved)) : null;
		return {
			items: parsed?.items.map(toItem) ?? [],
			inv: parsed?.inv ? createInventoryState(parsed.inv) : createInventoryState(),
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
	const initialData: IArsenalData = useMemo(() => arsenalDataFetcher(dataKey), [dataKey]);
	const [items, setItems] = useState(initialData.items);
	const [inventory, setInventory] = useState(initialData.inv);

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
