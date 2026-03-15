// shared/schemas/items.schema.ts
import * as v from "valibot";
import type { TAssertEqual } from "../../src/type";

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
const _schema: v.GenericSchema<_expected> = v.object({
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
type _type = TAssertEqual<v.InferOutput<typeof _schema>, _expected>;

// 4. export
export { _schema as ItemSchema };
export type { _type as TItem };
