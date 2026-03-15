// src/pages/game2/core/moduleCost.ts

const MODULE_COST_MATRIX: Record<number, [number, number, number]> = {
	6: [80_000, 100_000, 120_000],
	5: [40_000, 50_000, 60_000],
	4: [20_000, 20_000, 30_000],
};

const clampLevel = (level: number) => Math.min(Math.max(level, 0), 3);

export const calculateModuleCost = (rarity: number, fromLevel: number, toLevel: number): number => {
	const costs = MODULE_COST_MATRIX[rarity];
	if (!costs) return 0;

	const start = clampLevel(fromLevel);
	const end = clampLevel(toLevel);
	if (end <= start) return 0;

	let total = 0;
	for (let level = start; level < end; level++) {
		const stageCost = costs[level];
		if (stageCost) total += stageCost;
	}
	return total;
};

export const MODULE_COST_DISPLAY_ROWS = [
	{ rarity: 6, costs: MODULE_COST_MATRIX[6] as [number, number, number] },
	{ rarity: 5, costs: MODULE_COST_MATRIX[5] as [number, number, number] },
	{ rarity: 4, costs: MODULE_COST_MATRIX[4] as [number, number, number] },
	{ rarity: 3, costs: null },
	{ rarity: 2, costs: null },
	{ rarity: 1, costs: null },
] as const;
