import { describe, expect, it } from "vitest";
import { LV_MAX_MAP, validateLevel } from "./validateItem";
import { maxLevel } from "@/src/assets/level.json";

describe("validateLevel 邏輯測試", () => {
	describe("配置數據應該正確", () => {
		it("LV_MAX_MAP 數據應該正確", () => {
			const map = new Map<number, number[]>();
			let i = 0;
			for (const arr of maxLevel) {
				i += 1;
				map.set(i, arr);
			}
			expect(LV_MAX_MAP).toStrictEqual(map);
		});
	});

	describe("基礎邊界測試", () => {
		it("應該正確處理 1★ 和 2★ (只有 E0)", () => {
			expect(validateLevel(1, "0", "30")).toBe(true);
			expect(validateLevel(1, "0", "31")).toBe(false);
			expect(validateLevel(2, "1", "1")).toBe(false); // 2星沒有 E1
		});

		it("應該處理無效的稀有度", () => {
			expect(validateLevel(0, "0", "1")).toBe(false);
			expect(validateLevel(7, "0", "1")).toBe(false);
		});
	});

	describe("中間狀態測試 (E1 / E2)", () => {
		it("3★ 應該支援 E1 但不支援 E2", () => {
			expect(validateLevel(3, "1", "55")).toBe(true);
			expect(validateLevel(3, "1", "56")).toBe(false);
			expect(validateLevel(3, "2", "1")).toBe(false);
		});

		it("4★ 中間狀態驗證 (E0:45, E1:60, E2:70)", () => {
			expect(validateLevel(4, "0", "45")).toBe(true);
			expect(validateLevel(4, "1", "60")).toBe(true);
			expect(validateLevel(4, "1", "61")).toBe(false); // E1 超標
			expect(validateLevel(4, "2", "70")).toBe(true);
		});

		it("6★ 最高等級驗證", () => {
			expect(validateLevel(6, "2", "90")).toBe(true);
			expect(validateLevel(6, "2", "91")).toBe(false);
		});
	});

	describe("異常輸入測試", () => {
		it("應該攔截非數字字串", () => {
			expect(validateLevel(6, "精英二", "90")).toBe(false);
			expect(validateLevel(6, "2", "滿級")).toBe(false);
			expect(validateLevel(6, "", "")).toBe(false);
		});

		it("應該攔截負數或 0 級", () => {
			expect(validateLevel(6, "0", "0")).toBe(false);
			expect(validateLevel(6, "-1", "10")).toBe(false);
		});
	});
});
