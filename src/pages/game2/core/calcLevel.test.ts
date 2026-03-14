import { describe, expect, it } from "vitest";
import { calculateArknightsLevel } from "./calculateArknightsLevel";
import { levelTestCases } from "./levelTestCases";
import { levelDataFixture } from "./levelData.fixture";

describe("明日方舟練度計算驗證 (對標 Excel 數據)", () => {
  it.each(levelTestCases)(
    "星級 $star: [精$fE/Lv$fL] -> [精$tE/Lv$tL]",
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
