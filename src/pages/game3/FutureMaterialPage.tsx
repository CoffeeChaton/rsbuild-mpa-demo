import { useCallback, useState } from "react";
import useSWR from "swr";
import { Flex } from "@radix-ui/themes";

import { ITEM_DATA_KEY, itemFetcher } from "../game2/services/itemFetcher";
import { ImportDialog } from "./components/ImportDialog";
import { EditorDialog } from "./components/EditorDialog";
import { TableArea } from "./components/TableArea";
import { ToolbarArea } from "./components/ToolbarArea";
import type { TEditor, TFilter } from "./type";
import { usePlanManager } from "./hooks/usePlanManager";
import { useMaterialRows } from "./hooks/useMaterialRows";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { PlanContext } from "./context/PlanContext";

const NAVBAR_HEIGHT = 70; // px

export function FutureMaterialPage() {
  const { data: bundle } = useSWR(ITEM_DATA_KEY, itemFetcher);

  const [jsonA, setJsonA] = useLocalStorageState<string>(
    "fm_a_v5",
    "{}",
  );

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
  const { rows, groupedRows } = useMaterialRows(jsonA, tsvB, filter, bundle);

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
    setEditor((e) => ({ ...e, open: false }));
  };

  const loadDefaultToEditor = async (p: string) => {
    try {
      const m = await import(`./assets/${p}.tsv?raw`);
      setEditor((e) => ({ ...e, content: m.default }));
    } catch (error) {
      console.error("loadDefaultToEditor error", error);
    }
  };

  const copyResult = useCallback(() => {
    const result = Object.fromEntries(
      rows
        .filter(r => r.total > 0)
        .map(r => [r.id, r.total]),
    );

    navigator.clipboard.writeText(
      JSON.stringify(result, null, 2),
    );
  }, [rows]);

  return (
    <Flex direction="column" height={`calc(100vh - ${NAVBAR_HEIGHT}px)`} className="bg-[#f2f4f7] overflow-hidden">
      {/* ToolbarArea */}
      <PlanContext.Provider
        value={{
          planName,
          setPlanName,
          customPlans,
          setCustomPlans,
          tsvB,
        }}
      >
        <ToolbarArea
          rows={rows}
          setImportOpen={setImportOpen}
          setEditor={setEditor}
          filter={filter}
          setFilter={setFilter}
          copyResult={copyResult}
        />
      </PlanContext.Provider>

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
