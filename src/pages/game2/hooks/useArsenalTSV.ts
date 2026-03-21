// src/pages/game2/hooks/useArsenalTSV.ts
import { useCallback } from "react";
import { useClipboard } from "foxact/use-clipboard";
import type { IInventory, IItem, IRowResult } from "../types";

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

			const lines = text.trim().split(/\r?\n/);
			const newItems: IItem[] = [];

			// 使用 setInventory 的 callback 形式，避免閉包陷阱
			setInventory((prev) => {
				// 關鍵：必須對嵌套物件 bookStacks 進行展開拷貝，否則引用不變，useMemo 就不會觸發
				const nextInv: IInventory = {
					...prev,
					bookStacks: { ...prev.bookStacks },
				};

				lines.forEach((line) => {
					const c = line.split("\t");
					const tag = c[0]?.trim();

					// 1. 解析全局配置 #CONFIG
					if (tag === "#CONFIG") {
						const keyPath = c[1]?.trim();
						const value = Number(c[2]) || 0;

						switch (keyPath) {
							case "resource.money":
								nextInv.money = value;
								break;
							case "resource.exp_advanced":
								nextInv.bookStacks.advanced = value;
								break;
							case "resource.exp_intermediate":
								nextInv.bookStacks.intermediate = value;
								break;
							case "resource.exp_primary":
								nextInv.bookStacks.primary = value;
								break;
							case "resource.exp_basic":
								nextInv.bookStacks.basic = value;
								break;
							case "production.money":
								nextInv.avgMoneyProduction = value;
								break;
							case "production.exp":
								nextInv.avgBookProduction = value;
								break;
						}
					}

					// 2. 解析角色數據 #LIST_DATA
					if (tag === "#LIST_DATA") {
						newItems.push({
							id: crypto.randomUUID(),
							calculate: c[1]?.trim() === "O",
							rarity: Number(c[2]) || 6,
							name: c[3] || "",
							note: c[4] || "",
							moduleFrom: c[5] || "0",
							moduleTo: c[6] || "0",
							e1: c[7] || "0",
							l1: c[8] || "1",
							e2: c[9] || "0",
							l2: c[10] || "1",
						});
					}
				});

				return nextInv;
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
		const t = "\t";
		const { money, bookStacks, avgMoneyProduction, avgBookProduction } = inventory;

		const output: string[] = [
			`#CONFIG${t}resource.money${t}${money}${t}龍門幣`,
			`#CONFIG${t}resource.exp_advanced${t}${bookStacks.advanced}${t}高級作戰紀錄(個)`,
			`#CONFIG${t}resource.exp_intermediate${t}${bookStacks.intermediate}${t}中級作戰紀錄(個)`,
			`#CONFIG${t}resource.exp_primary${t}${bookStacks.primary}${t}初級作戰紀錄(個)`,
			`#CONFIG${t}resource.exp_basic${t}${bookStacks.basic}${t}基礎作戰紀錄(個)`,
			`#CONFIG${t}production.money${t}${avgMoneyProduction}${t}日產龍門幣`,
			`#CONFIG${t}production.exp${t}${avgBookProduction}${t}日產EXP`,
			"",
			"## 解析時會跳過空行與雙井字號開頭的註釋",
			`${t}${t}${t}${t}模組${t}${t}初始練度${t}${t}目標練度${t}${t}自動估算`,
			`標記${t}是否計算${t}星級${t}角色名${t}技能備註${t}FROM${t}TO${t}精英化${t}等級${t}精英化${t}等級${t}預估錢${t}預估書${t}累計錢${t}累計書`,
		];

		rows.forEach((r) => {
			const rowData = [
				"#LIST_DATA",
				r.calculate ? "O" : "X",
				r.rarity,
				r.name,
				r.note,
				r.moduleFrom,
				r.moduleTo,
				r.e1,
				r.l1,
				r.e2,
				r.l2,
				r.costMoney,
				r.costBooks,
				r.cumMoney,
				r.cumBooks,
			];
			output.push(rowData.join(t));
		});

		copy(output.join("\n"));
	}, [inventory, rows, copy]);

	return { handleImport, handleExport, isCopied };
};
