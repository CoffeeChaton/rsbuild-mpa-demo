import type { TAssertEqual } from "../../src/type";
import * as v from "valibot";

// 1. 定義基礎 類型
type _expected = {
	type: number,
	sortId: number,
	rare: number,
	formulaType: string | null,
	formula: Record<string, number> | null,
	name: {
		cn: string,
		tw: string,
		us: string,
	},
};

/**
 * @section 2. Implementation / Schema 實作
 * 確保運行時校驗邏輯符合上述契約
 */
export const ItemSchema: v.GenericSchema<_expected> = v.object({
	type: v.number(),
	sortId: v.number(),
	rare: v.number(),
	formulaType: v.fallback(v.nullable(v.string()), null),
	formula: v.fallback(v.nullable(v.record(v.string(), v.number())), null),
	name: v.object({
		cn: v.string(),
		tw: v.string(),
		us: v.string(),
	}),
});

// 3. 高階型別鎖定 (靜態斷言)，若 Schema 實作與 Expected 不符，此處會噴出型別錯誤 (never)
export type TItem = TAssertEqual<v.InferOutput<typeof ItemSchema>, _expected>;
