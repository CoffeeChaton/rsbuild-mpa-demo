import { describe, expect, it } from "vitest";
import { validateItem } from "./itemValidator";
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

	it("正常數據不應產生錯誤", () => {
		const result = validateItem({ ...baseItem, e2: "2", l2: "80" });
		expect(result.messages.length).toBe(0);
		expect(result.fields).toStrictEqual({});
	});

	it("應該攔截模組等級越界 (0~3)-初始", () => {
		const result = validateItem({ ...baseItem, moduleFrom: "5" });
		expect(result.fields.moduleFrom).toBe(true);
		expect(result.messages).toContain("初始模組等級 0~3");
	});

	it("應該攔截模組等級越界 (0~3)-目標", () => {
		const result = validateItem({ ...baseItem, moduleTo: "5" });
		expect(result.fields.moduleTo).toBe(true);
		expect(result.messages).toContain("目標模組等級 0~3");
	});

	it("應該攔截模組目標低於初始", () => {
		const result = validateItem({ ...baseItem, moduleFrom: "3", moduleTo: "1" });
		expect(result.fields.moduleRange).toBe(true);
		expect(result.messages).toContain("模組目標不可低於初始");
	});

	it("應該攔截等級超出上限 (E0 只能到 50)", () => {
		const result = validateItem({ ...baseItem, e1: "0", l1: "51" });
		expect(result.fields.l1).toBe(true);
		expect(result.messages).toContain("初始等級超出上限");
	});

	it("應該攔截精英化階段錯誤 (3星沒有 E2)", () => {
		const result = validateItem({ ...baseItem, rarity: 3, e2: "2", l2: "1" });
		expect(result.fields.e2).toBe(true);
		expect(result.messages).toContain("目標精英階段錯誤");
	});

	it("應該攔截進度倒退 (E2 -> E1)", () => {
		const result = validateItem({ ...baseItem, e1: "2", l1: "1", e2: "1", l2: "80" });
		expect(result.fields.progress).toBe(true);
		expect(result.messages).toContain("目標進度不可低於初始");
	});
});
