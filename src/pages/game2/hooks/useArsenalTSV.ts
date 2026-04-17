// src/pages/game2/hooks/useArsenalTSV.ts
import { useCallback } from "react";
import { useClipboard } from "foxact/use-clipboard";
import type { IInventory, IItem, IRowResult } from "../types";
import { applyConfigEntriesToInventory, formatArsenalTsv, parseArsenalTsv } from "../core/arsenalTsv";

export interface IArsenalActions {
	handleImport: () => Promise<void>;
	handleExport: () => void;
	isCopied: boolean;
}

export const useArsenalTSV = (
	setItems: (items: IItem[]) => void,
	inventory: IInventory,
	setInventory: React.Dispatch<React.SetStateAction<IInventory>>,
	rows: IRowResult[],
): IArsenalActions => {
	const { copy, copied: isCopied } = useClipboard({ timeout: 2000 });

	/**
	 * 導入邏輯：使用 Functional Update 確保拿到最新 State 並維持不可變性
	 */
	const handleImport = useCallback(async () => {
		try {
			const text = await navigator.clipboard.readText();
			if (!text) return;

			const { configEntries, items: newItems } = parseArsenalTsv(text);

			setInventory((prev) => {
				return applyConfigEntriesToInventory(prev, configEntries);
			});

			if (newItems.length > 0) {
				setItems(newItems);
			}
		} catch (error) {
			console.error("導入失敗", error);
		}
	}, [setInventory, setItems]);

	/**
	 * 導出邏輯：將當前狀態轉換為 TSV 格式
	 */
	const handleExport = useCallback(() => {
		void copy(formatArsenalTsv(inventory, rows));
	}, [inventory, rows, copy]);

	return { handleImport, handleExport, isCopied };
};
