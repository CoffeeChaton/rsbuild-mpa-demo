// src/pages/game2/hooks/useLevelData.ts
import useSWR from "swr";
import { LEVEL_DATA_URL, levelDataFetcher } from "../core/data";
import type { ILevelData } from "../core/data";

export const useLevelData = () => {
	const { data, error } = useSWR<ILevelData>(LEVEL_DATA_URL, levelDataFetcher, {
		revalidateOnFocus: false,
	});
	return {
		levelData: data,
		levelDataLoading: !data && !error,
		levelDataError: error,
	};
};
