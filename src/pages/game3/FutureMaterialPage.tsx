import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { Flex } from "@radix-ui/themes";
import { ITEM_DATA_KEY, itemFetcher } from "./services/itemFetcher";
import { ImportDialog } from "./components/ImportDialog";
import { EditorDialog } from "./components/EditorDialog";
import { TableArea } from "./components/TableArea";
import { ToolbarArea } from "./components/ToolbarArea";
import type { TFilter } from "./type";
import { type IPlanManagerContext, usePlanManager } from "./hooks/usePlanManager";
import { useMaterialRows } from "./hooks/useMaterialRows";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { PlanContext } from "./context/PlanContext";
import { useEditor } from "./hooks/useEditor";

const NAVBAR_HEIGHT = 70; // px

export function FutureMaterialPage() {
	const { data: bundle } = useSWR(ITEM_DATA_KEY, itemFetcher);
	const [jsonA, setJsonA] = useLocalStorageState<string>("fm_a_v5", "{}");
	const [filter, setFilter] = useState<TFilter>({ search: "", hideEmpty: true });
	const [importOpen, setImportOpen] = useState(false);

	// 1. Hook 回傳值已經穩定，直接拿來用
	const planManager: IPlanManagerContext = usePlanManager();
	const { editor, setEditorOpen } = useEditor();

	/** 3. 計算 Row 數據 */
	const { rows, groupedRows } = useMaterialRows(jsonA, planManager.tsvB, filter, bundle);

	/** 4. 合併 Context，這時只需合併 Page 專屬的 setEditorOpen */
	const planContextValue = useMemo(() => ({
		...planManager,
		setEditorOpen,
	}), [planManager, setEditorOpen]);

	/** 5. 複製內容 */
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
			<PlanContext.Provider value={planContextValue}>
				<ToolbarArea
					rows={rows}
					setImportOpen={setImportOpen}
					filter={filter}
					setFilter={setFilter}
					copyResult={copyResult}
				/>
				{/* TableArea */}
				<TableArea groupedRows={groupedRows} />

				{/* EditorDialog */}
				<EditorDialog
					key={editor.open ? `edit-${editor.targetId}` : "edit-closed"}
					open={editor.open}
					onOpenChange={setEditorOpen}
					initialData={editor}
				/>

				{/* Import Dialog */}
				<ImportDialog
					key={importOpen ? "open" : "closed"} // 透過 key 強制 Dialog 開啟時重新初始化 state
					importOpen={importOpen}
					setImportOpen={setImportOpen}
					jsonA={jsonA}
					setJsonA={setJsonA}
				/>
			</PlanContext.Provider>
		</Flex>
	);
}
