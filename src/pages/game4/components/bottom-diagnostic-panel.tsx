/**
 * 底部診斷面板容器 (BottomDiagnosticPanel)
 *
 * 預期行為：
 * 1. 提供一個可摺疊的底部容器，內含 `DiagnosticPanel`。
 * 2. 桌面版支持手動調整高度 (Resizable)。
 * 3. 桌面版默認展開，手機版默認收起。
 * 4. 支持快捷鍵 (Cmd+J 或 `) 切換狀態。
 *
 * 布局角色：
 * - 作為頁面最下方的數據匯總區域，呈現所有計算的「結果」。
 */

import {
	ActivityLogIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "@radix-ui/react-icons";
import { useCallback, useState } from "react";
import { useIsMobile } from "@/src/lib/use-mobile";
import * as Collapsible from "@radix-ui/react-collapsible";
import { DiagnosticPanel } from "./diagnostic-panel";
import { useHotkeys } from "react-hotkeys-hook";
import { cn, getModifierKey } from "@/src/lib/utils";
import { useResizableHeight } from "../hooks/UseResizableHeightProps";
import { Box, Flex, Text } from "@radix-ui/themes";

const HEIGHT_KEY = "diagnostic-height";

export const BottomDiagnosticPanel: React.FC = () => {
	const isMobile = useIsMobile();
	const modifier = getModifierKey();
	const [open, setOpen] = useState(!isMobile);

	// 高度調整邏輯 (僅桌面)
	const { height, panelRef, startResizing } = useResizableHeight({
		key: HEIGHT_KEY,
		defaultHeight: 260,
		minHeight: 160,
		maxHeight: 600,
		isMobile,
	});

	const toggle = useCallback(() => setOpen((prev) => !prev), []);

	// 快捷鍵邏輯
	useHotkeys("`", e => {
		e.preventDefault();
		toggle();
	}, { useKey: true });

	useHotkeys("mod+j", e => {
		e.preventDefault();
		toggle();
	});

	return (
		<Collapsible.Root
			open={open}
			onOpenChange={setOpen}
			className="flex flex-col border-t border-border bg-white dark:bg-gray-950 shrink-0 z-30"
		>
			{/* 1. 調整高度的 Handle (僅桌面展開時) */}
			{open && !isMobile && (
				<div
					onMouseDown={startResizing}
					className="h-1 w-full cursor-row-resize bg-transparent hover:bg-blue-500/30 transition-colors"
				/>
			)}

			{/* 2. 面板標題與切換按鈕 */}
			<Collapsible.Trigger asChild>
				<button
					title={`切換摘要面板 (${modifier}+J 或 \`)`}
					className="flex items-center justify-between px-4 py-2 border-b border-border bg-gray-50/50 dark:bg-gray-900/50 w-full text-left cursor-pointer hover:bg-blue-500/5 active:bg-blue-500/10 transition-colors group select-none outline-none"
				>
					<Flex align="center" gap="3">
						<ActivityLogIcon className="text-blue-500" />
						<Text size="1" weight="bold" className="uppercase tracking-[0.15em] text-gray-500 group-hover:text-blue-500 transition-colors">
							狀態摘要與診斷 / Diagnostics
						</Text>

						{/* 快捷鍵提示 (僅桌面) */}
						{!isMobile && (
							<Flex gap="1">
								<kbd className="h-4 rounded border border-border bg-white dark:bg-gray-900 px-1.5 font-mono text-[9px] text-gray-400">{modifier} J</kbd>
								<Text size="1" color="gray" className="opacity-30">or</Text>
								<kbd className="h-4 rounded border border-border bg-white dark:bg-gray-900 px-1.5 font-mono text-[9px] text-gray-400">`</kbd>
							</Flex>
						)}
					</Flex>

					<Box className="text-blue-500">
						{open
							? (
								<Flex align="center" gap="2">
									<Text size="1" weight="medium" className="animate-pulse">收起面板</Text>
									<ChevronDownIcon />
								</Flex>
							)
							: (
								<Flex align="center" gap="2">
									<Text size="1" weight="medium" className="animate-pulse">查看診斷結果</Text>
									<ChevronUpIcon />
								</Flex>
							)}
					</Box>
				</button>
			</Collapsible.Trigger>

			{/* 3. 面板內容：渲染 DiagnosticPanel */}
			<Collapsible.Content
				className={cn(
					"overflow-hidden bg-white dark:bg-gray-950",
					"data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-2 data-[state=open]:duration-300",
					"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-2 data-[state=closed]:duration-200",
				)}
			>
				<div
					ref={panelRef}
					style={{ height: isMobile ? "50vh" : height }}
					className="overflow-y-auto p-4 transition-[height] duration-200"
				>
					<DiagnosticPanel />
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	);
};
