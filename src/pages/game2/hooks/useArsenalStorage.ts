// src/pages/game2/hooks/useArsenalStorage.ts
import { useCallback, useMemo } from "react";
import useSWR from "swr";
import { STORAGE_KEY } from "../config/constants";
import type { IInventory, IItem } from "../types";
import { sanitizeBookStacks } from "../core/calculateBookStacksValue";

const toPositiveNumber = (value: unknown) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
};

const createInventoryState = (inv?: Partial<IInventory>): IInventory => ({
	money: toPositiveNumber(inv?.money),
	bookStacks: sanitizeBookStacks(inv?.bookStacks),
	avgMoneyProduction: toPositiveNumber(inv?.avgMoneyProduction),
	avgBookProduction: toPositiveNumber(inv?.avgBookProduction),
});

interface IArsenalData {
	items: IItem[];
	inv: IInventory;
}

const arsenalDataFetcher = (key: string): IArsenalData => {
	const saved = localStorage.getItem(key);
	const configId = key.replace(`${STORAGE_KEY}_data_`, "");

	if (!saved) {
		if (key === STORAGE_KEY || configId === "default") {
			const oldSaved = localStorage.getItem(STORAGE_KEY);
			if (oldSaved) {
				try {
					const parsed = JSON.parse(oldSaved);
					return {
						items: Array.isArray(parsed.items) ? parsed.items : [],
						inv: parsed.inv ? createInventoryState(parsed.inv) : createInventoryState(),
					};
				} catch { /* ignore */ }
			}
		}
		return { items: [], inv: createInventoryState() };
	}
	try {
		const parsed = JSON.parse(saved);
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

	const { data, mutate } = useSWR<IArsenalData>(dataKey, arsenalDataFetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		fallbackData: { items: [], inv: createInventoryState() },
	});

	const items = data?.items || [];
	const inventory = data?.inv || createInventoryState();

	const setItems = useCallback((value: IItem[] | ((prev: IItem[]) => IItem[])) => {
		mutate((prev) => {
			const currentItems = prev?.items || [];
			const nextItems = typeof value === "function" ? value(currentItems) : value;
			const nextData = { items: nextItems, inv: prev?.inv || createInventoryState() };
			localStorage.setItem(dataKey, JSON.stringify(nextData));
			return nextData;
		}, false);
	}, [dataKey, mutate]);

	const setInventory = useCallback((value: IInventory | ((prev: IInventory) => IInventory)) => {
		mutate((prev) => {
			const currentInv = prev?.inv || createInventoryState();
			const nextInv = typeof value === "function" ? value(currentInv) : value;
			const nextData = { items: prev?.items || [], inv: nextInv };
			localStorage.setItem(dataKey, JSON.stringify(nextData));
			return nextData;
		}, false);
	}, [dataKey, mutate]);

	return { items, setItems, inventory, setInventory };
};
