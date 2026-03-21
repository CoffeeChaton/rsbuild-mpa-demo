import { describe, expect, it } from "vitest";
import { calculateModuleCost } from "./moduleCost";

describe("calculateModuleCost", () => {
	// 1. 基礎總和測試

	it("sums all stages between moduleFrom and moduleTo for six-star", () => {
		// 80,000 + 100,000 + 120,000 = 300,000
		expect(calculateModuleCost(6, 0, 3)).toBe(300_000);
	});

	// 2. 參數化單一階段測試
	it.each([
		[6, 0, 1, 80_000],
		[6, 1, 2, 100_000],
		[6, 2, 3, 120_000],
		[5, 0, 1, 40_000],
		[5, 1, 2, 50_000],
		[5, 2, 3, 60_000],
		[4, 0, 1, 20_000],
		[4, 1, 2, 20_000],
		[4, 2, 3, 30_000],
	])("星級 %i 範圍 %i -> %i 消耗應為 %i", (rarity, fromLevel, toLevel, expected) => {
		expect(calculateModuleCost(rarity, fromLevel, toLevel)).toBe(expected);
	});

	it("應正確處理跨級範圍", () => {
		// 6星: 1->3 = 100k + 120k = 220,000
		expect(calculateModuleCost(6, 1, 3)).toBe(220_000);
		// 5星: 0->2 = 40k + 50k = 90,000
		expect(calculateModuleCost(5, 0, 2)).toBe(90_000);
		// 4星: 2->3 = 30,000
		expect(calculateModuleCost(4, 2, 3)).toBe(30_000);
	});

	it("returns zero for unsupported rarities or invalid ranges", () => {
		expect(calculateModuleCost(3, 0, 2)).toBe(0);
		expect(calculateModuleCost(6, 2, 1)).toBe(0);
		expect(calculateModuleCost(5, 0, 5)).toBe(150_000);
	});

	// 4. 異常與邊界情況處理
	describe("邊界與異常處理", () => {
		it("不支援模組的星級 (1-3) 應回傳 0", () => {
			expect(calculateModuleCost(3, 0, 3)).toBe(0);
			expect(calculateModuleCost(2, 0, 1)).toBe(0);
			expect(calculateModuleCost(1, 0, 3)).toBe(0);
		});

		it("當目標等級低於或等於起始等級時應回傳 0", () => {
			expect(calculateModuleCost(6, 2, 1)).toBe(0);
			expect(calculateModuleCost(6, 2, 2)).toBe(0);
		});

		it("應正確處理超出範圍的等級 (透過 clampLevel)", () => {
			// 5星: 0->5 應被修正為 0->3 = 40+50+60 = 150,000
			expect(calculateModuleCost(5, 0, 5)).toBe(150_000);
			// 6星: -1->1 應被修正為 0->1 = 80,000
			expect(calculateModuleCost(6, -1, 1)).toBe(80_000);
		});

		it("傳入無效星級時應回傳 0", () => {
			expect(calculateModuleCost(0, 0, 3)).toBe(0);
			expect(calculateModuleCost(7, 0, 3)).toBe(0);
		});
	});
});
