import { useEffect, useState } from "react";
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

  useEffect(() => {
    localStorage.setItem("fm_custom_plans", JSON.stringify(customPlans));
  }, [customPlans]);
  useEffect(() => {
    localStorage.setItem("fm_current_plan_name", planName);
  }, [planName]);

  const { rows, groupedRows } = useMaterialRows(jsonA, tsvB, bundle, filter);

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
