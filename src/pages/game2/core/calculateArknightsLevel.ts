import { data } from "./data";

// 定義等級數據結構

interface ICalcLevelProps {
  star: number;
  current: { elite: number, level: number, exp: number };
  target: { elite: number, level: number };
}

interface ICalcResult {
  expNeed: number;
  lmdNeed: number;
}

/**
 * 計算幹員升級所需消耗
 */
export const calculateArknightsLevel = (props: ICalcLevelProps): ICalcResult => {
  const { star, current, target } = props;

  const { maxLevel, characterExp, characterUpgradeCost, eliteCost } = data;

  let expNeed = 0;
  let lmdNeed = 0;

  // 1. 驗證星級索引 (star 1-6 對應索引 0-5)
  const starIdx = star - 1;
  const curMaxLevelByElite = maxLevel[starIdx];

  // 2. 處理當前等級到當前階段上限的剩餘部分
  if (current.level < curMaxLevelByElite[current.elite]) {
    // 獲取升下一級所需的總經驗
    const nextLevelExp = characterExp[current.elite][current.level - 1];
    if (nextLevelExp) {
      const remainingExp = nextLevelExp - current.exp;
      // 龍門幣按比例計算（公式：(剩餘經驗/總經驗) * 該級總消耗）
      const remainingLmd = (remainingExp / nextLevelExp) * characterUpgradeCost[current.elite][current.level - 1];

      expNeed += remainingExp;
      lmdNeed += remainingLmd;
    }
  }

  // 3. 跨階段循環計算
  for (let e = current.elite; e <= target.elite; e++) {
    // 如果發生精英化，加上精英化成本
    if (e > current.elite) {
      lmdNeed += eliteCost[starIdx][e - 1];
    }

    // 確定當前階段要算到哪一級
    // 如果是目標階段，算到 target.level；否則算到該階段滿級
    const limitLevel = e === target.elite ? target.level : curMaxLevelByElite[e];

    // 起始等級：如果是當前階段，從 current.level + 1 開始；否則從 1 級開始
    const startLevel = e === current.elite ? current.level + 1 : 1;

    for (let l = startLevel; l < limitLevel; l++) {
      expNeed += characterExp[e][l - 1];
      lmdNeed += characterUpgradeCost[e][l - 1];
    }
  }

  return {
    expNeed: Math.ceil(expNeed),
    lmdNeed: Math.ceil(lmdNeed),
  };
};
