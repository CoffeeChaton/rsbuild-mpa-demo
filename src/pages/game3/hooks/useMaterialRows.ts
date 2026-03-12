import { useMemo } from "react";
import { analyzeSource } from "../utils/analyzeSource";
import { RARE_LEVELS } from "../shared/constants/material";
import type { IItemRow, TFilter } from "../type";
import type { IItemDataBundle } from "../../game2/services/itemFetcher";

interface IItemBundle {
  items: Record<string, { name: { tw: string }, rare: number }>;
}

export function useMaterialRows(
  jsonA: string,
  tsvB: string,
  filter: TFilter,
  bundle: IItemDataBundle | undefined,
) {
  const dataA = useMemo(
    () => analyzeSource(jsonA, bundle, true),
    [jsonA, bundle],
  );

  const dataB = useMemo(
    () => analyzeSource(tsvB, bundle, false),
    [tsvB, bundle],
  );

  const rows = useMemo<IItemRow[]>(() => {
    const b = bundle as IItemBundle | undefined;
    if (!b) return [];
    const searchLower = filter.search.toLowerCase();
    return Object.keys(b.items)
      .reduce<IItemRow[]>((acc, id) => {
        const item = b.items[id];
        const name = item?.name.tw || id;

        // 先做 search filter，減少後續運算
        const matchSearch = name.toLowerCase().includes(searchLower);
        if (!matchSearch) return acc;

        const stock = dataA.get(id) || 0;
        const need = dataB.get(id) || 0;
        const hasData = stock !== 0 || need !== 0;

        if (filter.hideEmpty && !hasData) return acc;

        acc.push({
          id,
          name,
          rare: item?.rare || 0,
          stock,
          need,
          total: stock + need,
        });
        return acc;
      }, [])
      .sort((a, b) => b.rare - a.rare || a.id.localeCompare(b.id));
  }, [bundle, dataA, dataB, filter.search, filter.hideEmpty]);

  const groupedRows = useMemo(() => {
    const groups = Object.fromEntries(
      RARE_LEVELS.map(r => [r, []]),
    ) as Record<number, IItemRow[]>;

    rows.forEach((r) => {
      groups[r.rare]?.push(r);
    });

    return groups;
  }, [rows]);

  return {
    rows,
    groupedRows,
  };
}
