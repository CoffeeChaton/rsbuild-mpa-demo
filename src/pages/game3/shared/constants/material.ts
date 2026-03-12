export const RARE_LEVELS = [5, 4, 3, 2, 1] as const;

export type RareLevel = typeof RARE_LEVELS[number];
