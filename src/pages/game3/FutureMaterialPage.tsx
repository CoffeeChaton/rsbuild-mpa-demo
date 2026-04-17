import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { Flex } from "@radix-ui/themes";
import { useClipboard } from "foxact/use-clipboard";
import { toast } from "sonner";
import { ITEM_DATA_KEY, itemFetcher } from "./services/itemFetcher";
import { ImportErrorDialog } from "./components/ImportErrorDialog";
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

export const FutureMaterialPage: React.FC = () => {
	const { data: bundle } = useSWR(ITEM_DATA_KEY, itemFetcher, {
		revalidateOnFocus: false, // 視窗切換回來不用重新抓
		revalidateOnReconnect: false, // 斷線重連不用重新抓
		dedupingInterval: 3600000, // 一小時內只會抓一次
	});
	const [jsonA, setJsonA] = useLocalStorageState<string>("fm_a_v5", "{}");
	const [filter, setFilter] = useState<TFilter>({ search: "", hideEmpty: true });
	const [importError, setImportError] = useState<string | null>(null);
	const [isImportSuccess, setIsImportSuccess] = useState(false);

	// 1. Hook 回傳值已經穩定，直接拿來用
	const planManager: IPlanManagerContext = usePlanManager();
	const { editor, setEditorOpen } = useEditor();
	const { copy, copied } = useClipboard({ timeout: 2000 });

	/** 3. 計算 Row 數據 */
	const { rows, allRows, groupedRows } = useMaterialRows(jsonA, planManager.tsvB, filter, bundle);

	/** 4. 合併 Context，這時只需合併 Page 專屬的 setEditorOpen */
	const planContextValue = useMemo(() => ({
		...planManager,
		setEditorOpen,
	}), [planManager, setEditorOpen]);

	/** 5. 複製內容：使用 allRows 確保不受 UI 過濾影響 */
	const copyResult = useCallback(() => {
		const result = Object.fromEntries(
			allRows
				.filter(r => r.total > 0)
				.map(r => [r.id, r.total]),
		);

		copy(JSON.stringify(result, null, 2));
		toast.success("已複製到剪貼簿", {
			description: "數據已成功生成 JSON 並準備好用於導入",
		});
	}, [allRows, copy]);

	/** 6. 導入內容：直接讀取剪貼簿 */
	const handleImport = useCallback(async () => {
		try {
			const text = await navigator.clipboard.readText();
			if (!text) {
				setImportError("剪貼簿為空，請先複製原有數據");
				return;
			}

			// 驗證 JSON
			try {
				JSON.parse(text);
				setJsonA(text);
				setIsImportSuccess(true);
				window.setTimeout(() => setIsImportSuccess(false), 1800);
			} catch {
				setImportError("JSON 格式非法，請確保剪貼簿內容為有效的 JSON 格式物件");
			}
		} catch (err) {
			setImportError(err instanceof Error ? err.message : "無法讀取剪貼簿，請檢查權限");
		}
	}, [setJsonA]);

	return (
		<Flex direction="column" height={`calc(100vh - ${NAVBAR_HEIGHT}px)`} className="bg-(--gray-1) overflow-hidden relative">
			{/* ToolbarArea */}
			<PlanContext.Provider value={planContextValue}>
				<ToolbarArea
					rows={rows}
					handleImport={handleImport}
					filter={filter}
					setFilter={setFilter}
					copyResult={copyResult}
					isCopied={copied}
					isImportSuccess={isImportSuccess}
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

				{/* Import Error Dialog */}
				<ImportErrorDialog
					open={importError !== null}
					onOpenChange={(open) => !open && setImportError(null)}
					errorMessage={importError || ""}
				/>
			</PlanContext.Provider>
		</Flex>
	);
};
