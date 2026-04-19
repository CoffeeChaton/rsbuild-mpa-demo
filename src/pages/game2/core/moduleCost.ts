// src/pages/game2/core/moduleCost.ts

export const MODULE_COST_DISPLAY_ROWS = [
	{ rarity: 6, costs: [80000, 100000, 120000] },
	{ rarity: 5, costs: [40000, 50000, 60000] },
	{ rarity: 4, costs: [20000, 20000, 30000] },
	{ rarity: 3, costs: null },
	{ rarity: 2, costs: null },
	{ rarity: 1, costs: null },
] as const;

const clampLevel = (level: number) => Math.min(Math.max(level, 0), 3);

export const calculateModuleCost = (rarity: number, fromLevel: number, toLevel: number): number => {
	const costs = MODULE_COST_DISPLAY_ROWS.find((v) => v.rarity === rarity)?.costs;
	if (!costs) return 0;

	const start = clampLevel(fromLevel);
	const end = clampLevel(toLevel);
	if (end <= start) return 0;

	let total = 0;
	for (let level = start; level < end; level++) {
		total += costs[level];
	}
	return total;
};
