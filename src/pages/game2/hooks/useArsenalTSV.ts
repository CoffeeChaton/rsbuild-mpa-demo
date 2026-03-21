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
	setInventory: (inv: IInventory) => void,
	rows: IRowResult[],
): IArsenalActions => {
	const { copy, copied: isCopied } = useClipboard({ timeout: 2000 });

	const handleImport = useCallback(async () => {
		try {
			const text = await navigator.clipboard.readText();
			const lines = text.trim().split(/\r?\n/);

			const newItems: IItem[] = [];
			const newInv: IInventory = { ...inventory };

			lines.forEach((line) => {
				const c = line.split("\t");
				const tag = c[0]?.trim();

				// 1. 解析全局配置 #CONFIG
				if (tag === "#CONFIG") {
					const keyPath = c[1]?.trim();
					const value = Number(c[2]) || 0;

					if (keyPath === "resource.money") newInv.money = value;
					if (keyPath === "resource.exp_advanced") newInv.bookStacks.advanced = value;
					if (keyPath === "resource.exp_intermediate") newInv.bookStacks.intermediate = value;
					if (keyPath === "resource.exp_primary") newInv.bookStacks.primary = value;
					if (keyPath === "resource.exp_basic") newInv.bookStacks.basic = value;
					if (keyPath === "production.money") newInv.avgMoneyProduction = value;
					if (keyPath === "production.exp") newInv.avgBookProduction = value;
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

			if (newItems.length > 0) setItems(newItems);
			setInventory(newInv);
		} catch (error) {
			console.error("導入失敗", error);
		}
	}, [inventory, setInventory, setItems]);

	const handleExport = useCallback(() => {
		const t = "\t";
		const output: string[] = [
			`#CONFIG${t}resource.money${t}${inventory.money}${t}龍門幣`,
			`#CONFIG${t}resource.exp_advanced${t}${inventory.bookStacks.advanced}${t}高級作戰紀錄(個)`,
			`#CONFIG${t}resource.exp_intermediate${t}${inventory.bookStacks.basic}${t}中級作戰紀錄(個)`,
			`#CONFIG${t}resource.exp_primary${t}${inventory.bookStacks.primary}${t}初級作戰紀錄(個)`,
			`#CONFIG${t}resource.exp_basic${t}${inventory.bookStacks.basic}${t}基礎作戰紀錄(個)`,
			`#CONFIG${t}production.money${t}${inventory.avgMoneyProduction}${t}日產龍門幣`,
			`#CONFIG${t}production.exp${t}${inventory.avgBookProduction}${t}日產EXP`,
			"",
			"## 這裡可以放空行或註釋，解析時直接 skip",
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
