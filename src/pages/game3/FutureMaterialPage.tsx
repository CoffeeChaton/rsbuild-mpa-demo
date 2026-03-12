import { useCallback, useState } from "react";
import useSWR from "swr";
import { Flex } from "@radix-ui/themes";

import { ITEM_DATA_KEY, itemFetcher } from "../game2/services/itemFetcher";
import { ImportDialog } from "./components/ImportDialog";
import { EditorDialog } from "./components/EditorDialog";
import { TableArea } from "./components/TableArea";
import { ToolbarArea } from "./components/ToolbarArea";
import type { TFilter } from "./type";
import { usePlanManager } from "./hooks/usePlanManager";
import { useMaterialRows } from "./hooks/useMaterialRows";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { PlanContext } from "./context/PlanContext";
import { useEditor } from "./hooks/useEditor";

const NAVBAR_HEIGHT = 70; // px

export function FutureMaterialPage() {
  const { data: bundle } = useSWR(ITEM_DATA_KEY, itemFetcher);

  const [jsonA, setJsonA] = useLocalStorageState<string>("fm_a_v5", "{}");

  const {
    planName,
    setPlanName,
    customPlans,
    setCustomPlans,
    tsvB,
    updateCustomPlan,
    deletePlan,
  } = usePlanManager();

  const [filter, setFilter] = useState<TFilter>({ search: "", hideEmpty: true });

  const { editor, setEditorOpen } = useEditor();

  /** 當點擊「確認保存」時 */
  const onEditorSave = (title: string, content: string, targetId: string | null) => {
    updateCustomPlan(title, content, targetId);
    // 用統一方法關閉 Editor
    setEditorOpen(false);
  };

  const [importOpen, setImportOpen] = useState(false);
  const { rows, groupedRows } = useMaterialRows(jsonA, tsvB, filter, bundle);

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
          setEditorOpen,
          deletePlan,
        }}
      >
        <ToolbarArea
          rows={rows}
          setImportOpen={setImportOpen}
          filter={filter}
          setFilter={setFilter}
          copyResult={copyResult}
        />
      </PlanContext.Provider>

      {/* TableArea */}
      <TableArea groupedRows={groupedRows} />

      {/* EditorDialog */}
      <EditorDialog
        key={editor.open ? `edit-${editor.targetId}-${Date.now()}` : "edit-closed"}
        open={editor.open}
        onOpenChange={(v) => setEditorOpen(v)}
        initialData={{
          targetId: editor.targetId,
          title: editor.title,
          content: editor.content,
        }}
        onSave={onEditorSave}
        loadDefault={async (p: string) => {
          const m = await import(`./assets/${p}.tsv?raw`);
          return m.default as string;
        }}
      />

      {/* Import Dialog */}
      <ImportDialog
        key={importOpen ? "open" : "closed"} // 透過 key 強制 Dialog 開啟時重新初始化 state
        importOpen={importOpen}
        setImportOpen={setImportOpen}
        jsonA={jsonA}
        setJsonA={setJsonA}
      />
    </Flex>
  );
}
