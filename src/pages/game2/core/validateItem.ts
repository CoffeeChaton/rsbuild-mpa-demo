// config.ts
export const ARKNIGHTS_CONFIG = {
	"maxLevel": [
		[30], // 1★ (index 0)
		[30], // 2★ (index 1)
		[40, 55], // 3★ (index 2)
		[45, 60, 70], // 4★ (index 3)
		[50, 70, 80], // 5★ (index 4)
		[50, 80, 90], // 6★ (index 5)
	],
} as const;

export type TValidateLevelFn = (rarity: number, e: string, l: string) => boolean;

export const validateLevel: TValidateLevelFn = (rarity, e, l) => {
	// 陣列索引從 0 開始，所以稀有度 1 對應 index 0
	const rarityLevels = ARKNIGHTS_CONFIG.maxLevel[rarity - 1];

	if (!rarityLevels) return false;

	const eNum = parseInt(e, 10);
	const lNum = parseInt(l, 10);

	// 檢查數值是否為有效數字
	if (isNaN(eNum) || isNaN(lNum)) return false;

	// 檢查精英化階段 (e) 是否在該稀有度的陣列長度內
	// 例如 3★ 只有 index 0, 1 (E0, E1)
	if (eNum < 0 || eNum >= rarityLevels.length) return false;

	// 檢查等級 (l) 是否在 1 到上限之間
	const maxL = rarityLevels[eNum];
	return lNum >= 1 && lNum <= maxL;
};
