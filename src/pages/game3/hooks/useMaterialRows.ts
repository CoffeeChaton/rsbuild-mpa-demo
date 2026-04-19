import { useMemo } from "react";
import { analyzeSource } from "../utils/analyzeSource";
import { RARE_LEVELS } from "../shared/constants/material";
import type { IItemRow, TFilter } from "../type";
import type { IItemDataBundle } from "../services/itemFetcher";

export type UseMaterialRows = (jsonA: string, tsvB: string, filter: TFilter, bundle: IItemDataBundle | undefined) => {
	/** 用於顯示的過濾後數據 */
	rows: IItemRow[],
	/** 完整計算後的數據 (不論過濾條件)，用於導出 */
	allRows: IItemRow[],
	/** 按稀有度分組的過濾後數據 */
	groupedRows: Record<number, IItemRow[]>,
};

function createRareGroups(): Record<number, IItemRow[]> {
	const groups: Record<number, IItemRow[]> = {};

	for (const rareLevel of RARE_LEVELS) {
		groups[rareLevel] = [];
	}

	return groups;
}

export const useMaterialRows: UseMaterialRows = (
	jsonA: string,
	tsvB: string,
	filter: TFilter,
	bundle: IItemDataBundle | undefined,
) => {
	const dataA = useMemo(
		() => analyzeSource(jsonA, bundle, true),
		[jsonA, bundle],
	);

	const dataB = useMemo(
		() => analyzeSource(tsvB, bundle, false),
		[tsvB, bundle],
	);

	/** 1. 核心計算：計算出所有項目的數據 */
	const allRows = useMemo<IItemRow[]>(() => {
		const bundle2 = bundle;
		if (!bundle2) return [];
		return Object.keys(bundle2.items)
			.map((id) => {
				const item = bundle2.items[id];
				const name = item?.name.tw || id;
				const stock = dataA.get(id) || 0;
				const need = dataB.get(id) || 0;

				return {
					id,
					name,
					rare: item?.rare || 0,
					stock,
					need,
					total: stock + need,
				};
			})
			.sort((a, b) => b.rare - a.rare || a.id.localeCompare(b.id));
	}, [bundle, dataA, dataB]);

	/** 2. 應用過濾：用於 UI 顯示 */
	const rows = useMemo<IItemRow[]>(() => {
		const searchLower = filter.search.toLowerCase();
		return allRows.filter((r) => {
			// Search filter
			if (searchLower && !r.name.toLowerCase().includes(searchLower)) {
				return false;
			}
			// Empty filter
			const hasData = r.stock !== 0 || r.need !== 0;
			if (filter.hideEmpty && !hasData) {
				return false;
			}
			return true;
		});
	}, [allRows, filter.search, filter.hideEmpty]);

	/** 3. 分組數據 */
	const groupedRows = useMemo(() => {
		const groups = createRareGroups();

		rows.forEach((r) => {
			groups[r.rare]?.push(r);
		});

		return groups;
	}, [rows]);

	return {
		rows,
		allRows,
		groupedRows,
	};
};
