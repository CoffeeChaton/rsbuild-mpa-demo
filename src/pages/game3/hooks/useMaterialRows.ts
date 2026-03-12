import { useMemo } from "react";
import { analyzeSource } from "../utils/analyzeSource";
import type { IItemRow, TFilter } from "../type";

interface IItemBundle {
  items: Record<string, { name: { tw: string }, rare: number }>;
}

export function useMaterialRows(
  jsonA: string,
  tsvB: string,
  bundle: unknown,
  filter: TFilter,
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

    return Object.keys(b.items)
      .map((id) => {
        const stock = dataA.get(id) || 0;
        const need = dataB.get(id) || 0;

        return {
          id,
          name: b.items[id]?.name.tw || id,
          rare: b.items[id]?.rare || 0,
          stock,
          need,
          total: stock + need,
        };
      })
      .filter((r) => {
        const matchSearch = r.name
          .toLowerCase()
          .includes(filter.search.toLowerCase());

        const hasData = r.stock !== 0 || r.need !== 0;

        return filter.hideEmpty
          ? matchSearch && hasData
          : matchSearch;
      })
      .sort((a, b) => b.rare - a.rare || a.id.localeCompare(b.id));
  }, [bundle, dataA, dataB, filter]);

  const groupedRows = useMemo(() => {
    const groups: Record<number, IItemRow[]> = {
      5: [],
      4: [],
      3: [],
      2: [],
      1: [],
    };

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
