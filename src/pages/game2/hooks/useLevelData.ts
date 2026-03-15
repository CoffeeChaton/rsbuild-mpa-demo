// src/pages/game2/hooks/useLevelData.ts
import useSWR from "swr";
import { LEVEL_DATA_URL, levelDataFetcher } from "../core/levelDataFetcher";
import type { ILevelData } from "../core/data";

export type UseLevelData = () => {
	levelData: {
		maxLevel: number[][],
		characterExp: number[][],
		characterUpgradeCost: number[][],
		eliteCost: number[][],
	} | undefined,
	levelDataLoading: boolean,
	levelDataError: unknown,
};

export const useLevelData: UseLevelData = () => {
	const { data, error } = useSWR<ILevelData>(LEVEL_DATA_URL, levelDataFetcher, {
		revalidateOnFocus: false,
	});
	return {
		levelData: data,
		levelDataLoading: !data && !error,
		levelDataError: error,
	};
};
