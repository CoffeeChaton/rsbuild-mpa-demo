import { describe, expect, it } from "vitest";
import { applyConfigEntriesToInventory, formatArsenalTsv, parseArsenalTsv } from "./arsenalTsv";
import type { IInventory, IRowResult } from "../types";

const baseInventory: IInventory = {
	money: 100,
	bookStacks: {
		basic: 1,
		primary: 2,
		intermediate: 3,
		advanced: 4,
	},
	avgMoneyProduction: 5,
	avgBookProduction: 6,
};

describe("arsenalTsv", () => {
	it("parses config entries and list rows from TSV", () => {
		const text = [
			"#CONFIG\tresource.money\t500\t龍門幣",
			"#CONFIG\tproduction.exp\t700\t日產EXP",
			"#LIST_DATA\tO\t6\t能天使\t主力\t1\t3\t1\t50\t2\t90",
		].join("\n");

		const result = parseArsenalTsv(text, {
			createId: () => "item-1",
		});

		expect(result.configEntries).toStrictEqual([
			{ keyPath: "resource.money", value: 500 },
			{ keyPath: "production.exp", value: 700 },
		]);
		expect(result.items).toStrictEqual([
			{
				id: "item-1",
				calculate: true,
				rarity: 6,
				name: "能天使",
				note: "主力",
				moduleFrom: "1",
				moduleTo: "3",
				e1: "1",
				l1: "50",
				e2: "2",
				l2: "90",
			},
		]);
	});

	it("applies parsed config entries without mutating the source inventory", () => {
		const next = applyConfigEntriesToInventory(baseInventory, [
			{ keyPath: "resource.exp_advanced", value: 99 },
			{ keyPath: "production.money", value: 777 },
		]);

		expect(next).toStrictEqual({
			...baseInventory,
			bookStacks: {
				...baseInventory.bookStacks,
				advanced: 99,
			},
			avgMoneyProduction: 777,
		});
		expect(baseInventory.bookStacks.advanced).toBe(4);
	});

	it("formats inventory and rows into the exported TSV structure", () => {
		const rows: IRowResult[] = [{
			id: "r1",
			calculate: true,
			rarity: 6,
			name: "史爾特爾",
			note: "主 C",
			moduleFrom: "0",
			moduleTo: "3",
			e1: "0",
			l1: "1",
			e2: "2",
			l2: "90",
			costMoney: 123,
			costBooks: 456,
			cumMoney: 789,
			cumBooks: 999,
			status: "safe",
			moneyStatus: "safe",
			booksStatus: "safe",
		}];

		const result = formatArsenalTsv(baseInventory, rows);

		expect(result).toContain("#CONFIG\tresource.money\t100\t龍門幣");
		expect(result).toContain("#CONFIG\tresource.exp_advanced\t4\t高級作戰紀錄(個)");
		expect(result).toContain("#LIST_DATA\tO\t6\t史爾特爾\t主 C\t0\t3\t0\t1\t2\t90\t123\t456\t789\t999");
	});
});
