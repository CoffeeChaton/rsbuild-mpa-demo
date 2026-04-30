import type { TFilter } from "./type";
import { Flex } from "@radix-ui/themes";
import { useClipboard } from "foxact/use-clipboard";
import { useLocalStorage } from "foxact/use-local-storage";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { EditorDialog } from "./components/EditorDialog";
import { ImportErrorDialog } from "./components/ImportErrorDialog";
import { TableArea } from "./components/TableArea";
import { ToolbarArea } from "./components/ToolbarArea";
import { PlanContext } from "./context/PlanContext";
import { useEditor } from "./hooks/useEditor";
import { useMaterialRows } from "./hooks/useMaterialRows";
import { type IPlanManagerContext, usePlanManager } from "./hooks/usePlanManager";
import { ITEM_DATA_KEY, itemFetcher } from "./services/itemFetcher";

const NAVBAR_HEIGHT = 70;

export const FutureMaterialPage: React.FC = () => {
	const { data: bundle } = useSWR(ITEM_DATA_KEY, itemFetcher, {
		revalidateOnFocus: false, // 視窗切換回來不用重新抓
		revalidateOnReconnect: false, // 斷線重連不用重新抓
		dedupingInterval: 3600000, // 一小時內只會抓一次
	});

	const [jsonA, setJsonA] = useLocalStorage<string>("fm_a_v5", "{}");
	const [filter, setFilter] = useState<TFilter>({ search: "", hideEmpty: true });
	const [importError, setImportError] = useState<string | null>(null);
	const [isImportSuccess, setIsImportSuccess] = useState(false);

	const planManager: IPlanManagerContext = usePlanManager();
	const { editor, setEditorOpen } = useEditor();
	const { copy, copied } = useClipboard({ timeout: 2000 });

	const { rows, allRows } = useMaterialRows(jsonA, planManager.tsvB, filter, bundle);

	const planContextValue = useMemo(() => ({
		...planManager,
		setEditorOpen,
	}), [planManager, setEditorOpen]);

	const copyResult = useCallback(() => {
		const result = Object.fromEntries(
			allRows
				.filter(r => r.total > 0)
				.map(r => [r.id, r.total]),
		);

		void copy(JSON.stringify(result, null, 2));
		toast.success("已複製到剪貼簿", {
			description: "數據已成功生成 JSON 並準備好用於導入",
		});
	}, [allRows, copy]);

	const handleImport = useCallback(async () => {
		try {
			const text = await navigator.clipboard.readText();
			if (!text) {
				setImportError("剪貼簿為空，請先複製原有數據");
				return;
			}

			JSON.parse(text);
			setJsonA(text);
			setIsImportSuccess(true);
			window.setTimeout(() => setIsImportSuccess(false), 1800);
		} catch (err) {
			setImportError(err instanceof Error ? err.message : "JSON 格式非法或無法讀取剪貼簿");
		}
	}, [setJsonA]);

	const handleToolbarImport = useCallback(() => {
		void handleImport();
	}, [handleImport]);

	const onOpenChange = useCallback(() => {
		setImportError(null);
	}, [setImportError]);

	return (
		<Flex direction="column" height={`calc(100vh - ${NAVBAR_HEIGHT}px)`} className="bg-(--gray-1) overflow-hidden relative">
			<PlanContext value={planContextValue}>
				<ToolbarArea
					rows={rows}
					handleImport={handleToolbarImport}
					filter={filter}
					setFilter={setFilter}
					copyResult={copyResult}
					isCopied={copied}
					isImportSuccess={isImportSuccess}
				/>
				<TableArea rows={rows} />

				<EditorDialog
					key={editor.open ? `edit-${editor.targetId}` : "edit-closed"}
					open={editor.open}
					onOpenChange={setEditorOpen}
					initialData={editor}
				/>

				<ImportErrorDialog
					open={importError !== null}
					onOpenChange={onOpenChange}
					errorMessage={importError ?? ""}
				/>
			</PlanContext>
		</Flex>
	);
};
