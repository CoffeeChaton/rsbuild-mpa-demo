// src/pages/game2/hooks/useArsenalStorage.ts
import { useCallback, useEffect, useMemo, useRef } from "react";
import useSWR from "swr";
import { STORAGE_KEY } from "../config/constants";
import type { IInventory, IItem } from "../types";
import { sanitizeBookStacks } from "../core/calculateBookStacksValue";
import { toast } from "sonner";
import { useIsConfigLocked } from "@/src/common/hooks/useConfig";

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
	const channelRef = useRef<BroadcastChannel | null>(null);

	// 🔥 獲取全域同步的鎖定狀態
	const isLocked = useIsConfigLocked();

	const { data, mutate } = useSWR<IArsenalData>(dataKey, arsenalDataFetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		fallbackData: { items: [], inv: createInventoryState() },
	});

	useEffect(() => {
		const channelName = `broadcast_${dataKey}`;
		const bc = new BroadcastChannel(channelName);
		channelRef.current = bc;

		bc.onmessage = (event) => {
			if (event.data === "updated") {
				// 如果沒被鎖定，自動同步畫面
				if (!isLocked) {
					void mutate();
					toast.info("資料已即時同步", { id: `sync_${dataKey}` });
				} else {
					// 即使鎖定了，也要通知「有人在改，但我不動」
					toast.warning("檢測到其他視窗的修改，但此帳號已鎖定保護", { id: `sync_blocked_${dataKey}` });
				}
			}
		};

		return () => bc.close();
	}, [dataKey, isLocked, mutate]);

	const checkGlobalLock = useCallback(() => {
		if (isLocked) {
			toast.error("操作被拒絕：此帳號目前處於「全域鎖定」模式", {
				description: "必須先點擊上方的鎖頭解除鎖定，才能進行任何修改",
				duration: 4000,
			});
			return false;
		}
		return true;
	}, [isLocked]);

	const broadcastUpdate = useCallback(() => {
		channelRef.current?.postMessage("updated");
	}, []);

	const items = data?.items || [];
	const inventory = data?.inv || createInventoryState();

	const setItems = useCallback((value: IItem[] | ((prev: IItem[]) => IItem[])): void => {
		if (!checkGlobalLock()) return;

		void mutate((prev) => {
			const currentItems = prev?.items || [];
			const nextItems = typeof value === "function" ? value(currentItems) : value;
			const nextData = { items: nextItems, inv: prev?.inv || createInventoryState() };
			localStorage.setItem(dataKey, JSON.stringify(nextData));
			return nextData;
		}, false);
		broadcastUpdate();
		toast.success("需求列表已儲存", { id: `save_items_${dataKey}` });
	}, [checkGlobalLock, dataKey, mutate, broadcastUpdate]);

	const setInventory = useCallback((value: IInventory | ((prev: IInventory) => IInventory)): void => {
		if (!checkGlobalLock()) return;

		void mutate((prev) => {
			const currentInv = prev?.inv || createInventoryState();
			const nextInv = typeof value === "function" ? value(currentInv) : value;
			const nextData = { items: prev?.items || [], inv: nextInv };
			localStorage.setItem(dataKey, JSON.stringify(nextData));
			return nextData;
		}, false);
		broadcastUpdate();
		toast.success("庫存資訊已儲存", { id: `save_inv_${dataKey}` });
	}, [checkGlobalLock, dataKey, mutate, broadcastUpdate]);

	return { items, setItems, inventory, setInventory };
};
