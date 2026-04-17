import { type FC, memo, useCallback, useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DropdownMenu,
	Flex,
	Text,
	TextField,
} from "@radix-ui/themes";
import {
	ChevronDownIcon,
	MagicWandIcon,
} from "@radix-ui/react-icons";
import { getDefaultPlanContent } from "../assets/planLoader";
import type { TEditor } from "../type";
import { type IPlanContext, usePlanContext } from "../context/PlanContext";

export interface IEditorDialogParam {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialData: TEditor;
}

export const EditorDialog: FC<IEditorDialogParam> = memo(({
	open,
	onOpenChange,
	initialData,
}) => {
	// 從 Context 取得更新方法
	const planContext: IPlanContext = usePlanContext();
	const [tempTitle, setTempTitle] = useState(initialData.title);
	const [tempContent, setTempContent] = useState(initialData.content);

	const handleInternalSave = useCallback(() => {
		if (!planContext) return;
		planContext.updateCustomPlan(tempTitle, tempContent, initialData.targetId);
		onOpenChange(false);
	}, [initialData.targetId, onOpenChange, planContext, tempContent, tempTitle]);

	const handleImportPlanB = useCallback(() => {
		setTempContent(getDefaultPlanContent("plan_b"));
	}, []);
	const handleImportPlanC = useCallback(() => {
		setTempContent(getDefaultPlanContent("plan_c"));
	}, []);
	const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setTempTitle(e.target.value);
	}, []);
	const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTempContent(e.target.value);
	}, []);

	return (
		<Dialog.Root
			open={open}
			onOpenChange={onOpenChange}
		>
			<Dialog.Content className="max-w-175 overflow-hidden rounded-3xl p-0">
				<Box p="4" className="border-b">
					<Flex justify="between" align="center">
						<Text weight="bold">方案編輯器</Text>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<Button size="1" variant="soft" color="indigo">
									<MagicWandIcon /> 參考預設內容 <ChevronDownIcon />
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Item onClick={handleImportPlanB}>導入 方案 无忧梦呓</DropdownMenu.Item>
								<DropdownMenu.Item onClick={handleImportPlanC}>導入 方案 辭歲行</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Flex>
				</Box>
				<Box p="4">
					<Flex direction="column" gap="3">
						<Box>
							<Text as="label" size="1" weight="bold" color="gray" mb="1">方案名稱</Text>
							<TextField.Root
								placeholder="輸入方案標題..."
								className="border-none"
								value={tempTitle}
								onChange={handleTitleChange}
							/>
						</Box>
						<Box>
							<Text as="label" size="1" weight="bold" color="gray" mb="1">TSV 數據內容</Text>
							<textarea
								placeholder="活動名稱	產物	數量"
								className="w-full h-72 p-4 rounded-xl border-none font-mono text-xs focus:ring-2 ring-indigo-500 outline-none"
								value={tempContent}
								onChange={handleContentChange}
							/>
						</Box>
					</Flex>
					<Flex gap="3" mt="4" justify="end">
						<Dialog.Close>
							<Button variant="soft" color="gray">取消</Button>
						</Dialog.Close>
						<Button color="indigo" onClick={handleInternalSave}>確認保存</Button>
					</Flex>
				</Box>
			</Dialog.Content>
		</Dialog.Root>
	);
});
