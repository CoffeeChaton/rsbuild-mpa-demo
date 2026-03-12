import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { Flex } from "@radix-ui/themes";

import { ITEM_DATA_KEY, itemFetcher } from "../game2/services/itemFetcher";
import { ImportDialog } from "./components/ImportDialog";
import { EditorDialog } from "./components/EditorDialog";
import { TableArea } from "./components/TableArea";
import { ToolbarArea } from "./components/ToolbarArea";
import type { TEditor, TFilter } from "./type";
import { analyzeSource, type IItemBundle } from "./utils/analyzeSource";
import { usePlanManager } from "./hooks/usePlanManager";

const NAVBAR_HEIGHT = 70; // px
interface IItemRow {
  id: string;
  name: string;
  rare: number;
  stock: number;
  need: number;
  total: number;
}

export function FutureMaterialPage() {
  const { data: bundle } = useSWR(ITEM_DATA_KEY, itemFetcher);

  const [jsonA, setJsonA] = useState<string>(() => localStorage.getItem("fm_a_v5") || "{}");

  const {
    planName,
    setPlanName,
    customPlans,
    setCustomPlans,
    tsvB,
  } = usePlanManager();

  const [filter, setFilter] = useState<TFilter>({
    search: "",
    hideEmpty: true,
  });

  // Editor States
  const [editor, setEditor] = useState<TEditor>({
    open: false,
    targetId: null as string | null,
    title: "",
    content: "",
  });

  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("fm_a_v5", jsonA);
  }, [jsonA]);
  useEffect(() => {
    localStorage.setItem("fm_custom_plans", JSON.stringify(customPlans));
  }, [customPlans]);
  useEffect(() => {
    localStorage.setItem("fm_current_plan_name", planName);
  }, [planName]);

  const dataA = useMemo(() => analyzeSource(jsonA, bundle, true), [jsonA, bundle]);
  const dataB = useMemo(() => analyzeSource(tsvB, bundle, false), [tsvB, bundle]);

  const rows = useMemo<IItemRow[]>(() => {
    const b = bundle as IItemBundle | undefined;
    if (!b) return [];
    return Object.keys(b.items).map(id => {
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
      .filter(r => {
        const matchSearch = r.name.toLowerCase().includes(filter.search.toLowerCase());
        const hasData = r.stock !== 0 || r.need !== 0;
        return filter.hideEmpty ? (matchSearch && hasData) : matchSearch;
      })
      .sort((a, b) => b.rare - a.rare || a.id.localeCompare(b.id));
  }, [dataA, dataB, bundle, filter]);

  const groupedRows = useMemo(() => {
    const groups: Record<number, IItemRow[]> = { 5: [], 4: [], 3: [], 2: [], 1: [] };
    rows.forEach(r => groups[r.rare]?.push(r));
    return groups;
  }, [rows]);

  const handleSavePlan = () => {
    const next = { ...customPlans };
    const title = editor.title.trim() || "未命名方案";

    // 如果是編輯舊有的，且名字改了，要刪除舊的 key
    if (editor.targetId && editor.targetId !== title) {
      delete next[editor.targetId];
    }

    next[title] = editor.content;
    setCustomPlans(next);
    setPlanName(title);
    setEditor({ ...editor, open: false });
  };

  const loadDefaultToEditor = async (p: string) => {
    try {
      const m = await import(`./assets/${p}.tsv?raw`);
      setEditor({ ...editor, content: m.default });
    } catch (error) {
      console.error("loadDefaultToEditor error", error);
    }
  };

  return (
    <Flex direction="column" height={`calc(100vh - ${NAVBAR_HEIGHT}px)`} className="bg-[#f2f4f7] overflow-hidden">
      {/* ToolbarArea */}
      <ToolbarArea
        rows={rows}
        planName={planName}
        setPlanName={setPlanName}
        customPlans={customPlans}
        setCustomPlans={setCustomPlans}
        tsvB={tsvB}
        setImportOpen={setImportOpen}
        setEditor={setEditor}
        filter={filter}
        setFilter={setFilter}
      />

      {/* TableArea */}
      <TableArea groupedRows={groupedRows} />

      {/* EditorDialog */}
      <EditorDialog
        loadDefaultToEditor={loadDefaultToEditor}
        handleSavePlan={handleSavePlan}
        editor={editor}
        setEditor={setEditor}
      />

      {/* Import Dialog */}
      <ImportDialog
        importOpen={importOpen}
        setImportOpen={setImportOpen}
        jsonA={jsonA}
        setJsonA={setJsonA}
      />
    </Flex>
  );
}
