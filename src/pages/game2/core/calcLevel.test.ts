import * as v from "valibot";
import { describe, expect, it } from "vitest";
import rawLevelData from "@/src/assets/level.json";
import { calculateArknightsLevel } from "./calculateArknightsLevel";
import { type ILevelData, LevelDataSchema } from "./data";
import { levelTestCases } from "./levelTestCases";

describe("明日方舟練度計算驗證 (對標 Excel 數據)", () => {
	const levelDataFixture: ILevelData = v.parse(LevelDataSchema, rawLevelData);

	it.each(levelTestCases)(
		"星級 $star: [精$fE/Lv$fL] -> [精$tE/Lv$tL]",
		{ timeout: 10000 },
		({ star, fE, fL, tE, tL, exp, lmd }) => {
			const result = calculateArknightsLevel({
				star,
				current: { elite: fE, level: fL },
				target: { elite: tE, level: tL },
			}, levelDataFixture);

			expect(result).toEqual({
				expNeed: exp, // 1. 驗證經驗值
				lmdNeed: lmd, // 2. 驗證龍門幣
			});
		},
	);
});
