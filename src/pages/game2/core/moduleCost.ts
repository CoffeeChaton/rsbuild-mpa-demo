// src/pages/game2/core/moduleCost.ts

const MODULE_COST_MATRIX: Record<number, [number, number, number]> = {
	6: [80000, 100000, 120000],
	5: [40000, 50000, 60000],
	4: [20000, 20000, 30000],
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

export type TMODULE_COST_DISPLAY_ROWS = readonly [
	{
		readonly rarity: 6,
		readonly costs: [number, number, number],
	},
	{
		readonly rarity: 5,
		readonly costs: [number, number, number],
	},
	{
		readonly rarity: 4,
		readonly costs: [number, number, number],
	},
	{
		readonly rarity: 3,
		readonly costs: null,
	},
	{
		readonly rarity: 2,
		readonly costs: null,
	},
	{
		readonly rarity: 1,
		readonly costs: null,
	},
];

export const MODULE_COST_DISPLAY_ROWS: TMODULE_COST_DISPLAY_ROWS = [
	{ rarity: 6, costs: MODULE_COST_MATRIX[6] },
	{ rarity: 5, costs: MODULE_COST_MATRIX[5] },
	{ rarity: 4, costs: MODULE_COST_MATRIX[4] },
	{ rarity: 3, costs: null },
	{ rarity: 2, costs: null },
	{ rarity: 1, costs: null },
];
