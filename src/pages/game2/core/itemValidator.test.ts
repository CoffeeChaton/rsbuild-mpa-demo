import { describe, expect, it } from "vitest";
import { ITEM_ERR_MSG, validateItem } from "./itemValidator";
import type { IItem } from "../types";

describe("validateItem 業務邏輯測試", () => {
	const baseItem: IItem = {
		id: "1",
		rarity: 5,
		name: "阿米婭",
		calculate: true,
		note: "",
		moduleFrom: "0",
		moduleTo: "0",
		e1: "0",
		l1: "1",
		e2: "0",
		l2: "1",
	};

	it("正常數據不應產生錯誤", { timeout: 10000 }, () => {
		const result = validateItem({ ...baseItem, e2: "2", l2: "80" });
		expect(result.messages.length).toBe(0);
		expect(result.fields).toStrictEqual({});
	});

	it("應該攔截模組等級越界 (0~3)-初始", { timeout: 10000 }, () => {
		const result = validateItem({ ...baseItem, moduleFrom: "5" });
		const expected = `初始模組 ${ITEM_ERR_MSG.MODULE_RANGE}`;
		expect(result.fields.moduleFrom).toBe(expected);
		expect(result.messages).toContain(expected);
	});

	it("應該攔截模組等級越界 (0~3)-目標", { timeout: 10000 }, () => {
		const result = validateItem({ ...baseItem, moduleTo: "5" });
		const expected = `目標模組 ${ITEM_ERR_MSG.MODULE_RANGE}`;
		expect(result.fields.moduleTo).toBe(expected);
		expect(result.messages).toContain(expected);
	});

	it("應該攔截模組目標低於初始", { timeout: 10000 }, () => {
		const result = validateItem({ ...baseItem, moduleFrom: "3", moduleTo: "1" });
		expect(result.fields.moduleTo).toBe(`目標模組${ITEM_ERR_MSG.MODULE_LOW_TARGET}`);
	});

	it("應該攔截等級超出上限 (5星 E0 只能到 50)", { timeout: 10000 }, () => {
		const result = validateItem({ ...baseItem, e1: "0", l1: "51" });
		expect(result.fields.l1).toBe(ITEM_ERR_MSG.INVALID_L_FROM);
	});

	it("應該攔截精英化階段錯誤 (3星沒有 E2)", { timeout: 10000 }, () => {
		const result = validateItem({ ...baseItem, rarity: 3, e2: "2", l2: "1" });
		expect(result.fields.e2).toBe(ITEM_ERR_MSG.INVALID_E_TO);
	});

	it("應該攔截進度倒退 (E2 -> E1)", { timeout: 10000 }, () => {
		const result = validateItem({ ...baseItem, e1: "2", l1: "1", e2: "1", l2: "80" });
		// 因為 progress 錯誤會同時標註在 e2, l2, progress 欄位
		expect(result.fields.progress).toBe(ITEM_ERR_MSG.PROGRESS_BACKWARD);
		expect(result.fields.e2).toBe(ITEM_ERR_MSG.PROGRESS_BACKWARD);
		expect(result.messages).toContain(ITEM_ERR_MSG.PROGRESS_BACKWARD);
	});

	it("應該攔截低星級填寫模組", { timeout: 10000 }, () => {
		const result = validateItem({ ...baseItem, rarity: 3, moduleFrom: "1" });
		expect(result.fields.moduleFrom).toBe(ITEM_ERR_MSG.MODULE_NOT_SUPPORTED);
	});
});
