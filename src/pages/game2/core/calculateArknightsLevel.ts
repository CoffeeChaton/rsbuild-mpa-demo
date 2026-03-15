import type { ILevelData } from "./data";

interface ICalcLevelProps {
	star: number;
	current: { elite: number, level: number };
	target: { elite: number, level: number };
}

interface ICalcResult {
	expNeed: number;
	lmdNeed: number;
}

/**
 * 計算幹員升級所需消耗
 */
export const calculateArknightsLevel = (
	props: ICalcLevelProps,
	levelData: ILevelData,
): ICalcResult => {
	const { star, current, target } = props;

	// --- 相同等級 ---
	if (current.elite === target.elite && current.level === target.level) {
		return { expNeed: 0, lmdNeed: 0 };
	}

	// --- 非法輸入 ---
	if (current.elite > target.elite || (current.elite === target.elite && current.level > target.level)) {
		return { expNeed: 0, lmdNeed: 0 };
	}

	const { maxLevel, characterExp, characterUpgradeCost, eliteCost } = levelData;

	const starIdx = star - 1;
	const maxLevelByElite = maxLevel[starIdx];

	let expNeed = 0;
	let lmdNeed = 0;

	for (let elite = current.elite; elite <= target.elite; elite++) {
		// --- 精英化成本 ---
		if (elite > current.elite) {
			lmdNeed += eliteCost[starIdx][elite - 1];
		}

		const startLevel = elite === current.elite ? current.level : 1;

		const endLevel = elite === target.elite ? target.level : maxLevelByElite[elite];

		for (let lvl = startLevel; lvl < endLevel; lvl++) {
			expNeed += characterExp[elite][lvl - 1];
			lmdNeed += characterUpgradeCost[elite][lvl - 1];
		}
	}

	return {
		expNeed: Math.ceil(expNeed),
		lmdNeed: Math.ceil(lmdNeed),
	};
};
