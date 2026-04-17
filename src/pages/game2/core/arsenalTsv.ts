import type { IInventory, IItem, IRowResult } from "../types";

interface IConfigEntry {
	keyPath: string;
	value: number;
}

export interface IParsedArsenalTsv {
	configEntries: IConfigEntry[];
	items: IItem[];
}

export interface IParseArsenalTsvOptions {
	createId?: () => string;
}

const DEFAULT_CREATE_ID = (): string => crypto.randomUUID();

export const parseArsenalTsv = (
	text: string,
	options: IParseArsenalTsvOptions = {},
): IParsedArsenalTsv => {
	const createId = options.createId ?? DEFAULT_CREATE_ID;
	const lines = text.trim().split(/\r?\n/);
	const configEntries: IConfigEntry[] = [];
	const items: IItem[] = [];

	lines.forEach((line) => {
		const cells = line.split("\t");
		const tag = cells[0]?.trim();

		if (tag === "#CONFIG") {
			configEntries.push({
				keyPath: cells[1]?.trim() || "",
				value: Number(cells[2]) || 0,
			});
		}

		if (tag === "#LIST_DATA") {
			items.push({
				id: createId(),
				calculate: cells[1]?.trim() === "O",
				rarity: Number(cells[2]) || 6,
				name: cells[3] || "",
				note: cells[4] || "",
				moduleFrom: cells[5] || "0",
				moduleTo: cells[6] || "0",
				e1: cells[7] || "0",
				l1: cells[8] || "1",
				e2: cells[9] || "0",
				l2: cells[10] || "1",
			});
		}
	});

	return { configEntries, items };
};

export const applyConfigEntriesToInventory = (
	inventory: IInventory,
	configEntries: IConfigEntry[],
): IInventory => {
	const nextInventory: IInventory = {
		...inventory,
		bookStacks: { ...inventory.bookStacks },
	};

	configEntries.forEach(({ keyPath, value }) => {
		switch (keyPath) {
			case "resource.money":
				nextInventory.money = value;
				break;
			case "resource.exp_advanced":
				nextInventory.bookStacks.advanced = value;
				break;
			case "resource.exp_intermediate":
				nextInventory.bookStacks.intermediate = value;
				break;
			case "resource.exp_primary":
				nextInventory.bookStacks.primary = value;
				break;
			case "resource.exp_basic":
				nextInventory.bookStacks.basic = value;
				break;
			case "production.money":
				nextInventory.avgMoneyProduction = value;
				break;
			case "production.exp":
				nextInventory.avgBookProduction = value;
				break;
		}
	});

	return nextInventory;
};

export const formatArsenalTsv = (
	inventory: IInventory,
	rows: IRowResult[],
): string => {
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

	rows.forEach((row) => {
		output.push([
			"#LIST_DATA",
			row.calculate ? "O" : "X",
			row.rarity,
			row.name,
			row.note,
			row.moduleFrom,
			row.moduleTo,
			row.e1,
			row.l1,
			row.e2,
			row.l2,
			row.costMoney,
			row.costBooks,
			row.cumMoney,
			row.cumBooks,
		].join(t));
	});

	return output.join("\n");
};
