import { describe, expect, it } from "vitest";
import { calculateModuleCost } from "./moduleCost";

describe("calculateModuleCost", () => {
	it("sums all stages between moduleFrom and moduleTo for six-star", () => {
		expect(calculateModuleCost(6, 0, 3)).toBe(300_000);
	});

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
	])("matches rarity %s cost for range %s -> %s", (rarity, fromLevel, toLevel, expected) => {
		expect(calculateModuleCost(rarity, fromLevel, toLevel)).toBe(expected);
	});

	it("respects partial ranges", () => {
		expect(calculateModuleCost(6, 1, 3)).toBe(220_000);
		expect(calculateModuleCost(5, 0, 2)).toBe(90_000);
		expect(calculateModuleCost(4, 2, 3)).toBe(30_000);
	});

	it("returns zero for unsupported rarities or invalid ranges", () => {
		expect(calculateModuleCost(3, 0, 2)).toBe(0);
		expect(calculateModuleCost(6, 2, 1)).toBe(0);
		expect(calculateModuleCost(5, 0, 5)).toBe(150_000);
	});
});
