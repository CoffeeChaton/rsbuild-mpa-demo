import * as v from "valibot";

const NumberListSchema = v.array(v.number());

export const LevelDataSchema = v.object({
	maxLevel: v.array(NumberListSchema),
	characterExp: v.array(NumberListSchema),
	characterUpgradeCost: v.array(NumberListSchema),
	eliteCost: v.array(NumberListSchema),
});

export type ILevelData = v.InferOutput<typeof LevelDataSchema>;

export const LEVEL_DATA_URL = `${import.meta.env.BASE_URL}data/level.json`.replace(/\/+/g, "/");

/**
 * 來源數據：https://github.com/arkntools/arknights-toolbox-data/blob/main/assets/data/level.json
 */
export const levelDataFetcher = async (url: string = LEVEL_DATA_URL): Promise<ILevelData> => {
	const response = await fetch(url);
	if (!response.ok) throw new Error("Failed to fetch level data");

	const rawData = await response.json();
	return v.parse(LevelDataSchema, rawData);
};
