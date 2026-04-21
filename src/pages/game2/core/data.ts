import type { TAssertEqual } from "../../../type";
import * as v from "valibot";

// 1. 定義基礎 類型
type _expected = {
	maxLevel: number[][],
	characterExp: number[][],
	characterUpgradeCost: number[][],
	eliteCost: number[][],
};

const NumberListSchema = v.array(v.number());

// 2. 定義 Valibot Schema
export const LevelDataSchema: v.GenericSchema<_expected> = v.object({
	maxLevel: v.array(NumberListSchema),
	characterExp: v.array(NumberListSchema),
	characterUpgradeCost: v.array(NumberListSchema),
	eliteCost: v.array(NumberListSchema),
});

// 3. 高階型別鎖定 (靜態斷言)
export type ILevelData = TAssertEqual<v.InferOutput<typeof LevelDataSchema>, _expected>;
