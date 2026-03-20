/**
 * 左側側邊欄容器 (LeftSidebar)
 *
 * 預期行為：
 * 1. 提供一個可摺疊的容器，內含 `BasicInfoPanel`。
 * 2. 桌面版支持水平展開/收起，手機版支持垂直展開/收起。
 * 3. 記錄開關狀態於 `localStorage`。
 * 4. 支持快捷鍵 (Cmd+B) 切換狀態。
 *
 * 佈局修正：
 * - 修復直向文字 (writing-mode) 時圖標與文字換列的問題。
 */

import { useHotkeys } from "react-hotkeys-hook";
import { cn, getModifierKey } from "@/src/lib/utils";
import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronUpIcon,
	InfoCircledIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useIsMobile } from "@/src/lib/use-mobile";
import { BasicInfoPanel } from "./basic-info-panel";
import { Box, Flex, Text } from "@radix-ui/themes";

const SIDEBAR_KEY = "sidebarOpen";

export const LeftSidebar: React.FC = () => {
	const isMobile = useIsMobile();

	// 從本地存儲恢復開關狀態
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
		if (typeof window === "undefined") return true;
		const saved = localStorage.getItem(SIDEBAR_KEY);
		if (saved !== null) return saved === "true";
		return !isMobile;
	});

	useEffect(() => {
		localStorage.setItem(SIDEBAR_KEY, String(sidebarOpen));
	}, [sidebarOpen]);

	// 快捷鍵：Cmd+B 切換開關
	useHotkeys("mod+b", () => setSidebarOpen(prev => !prev));
	const modifier = getModifierKey();
	return (
		<Collapsible.Root
			open={sidebarOpen}
			onOpenChange={setSidebarOpen}
			className={cn(
				"border-border transition-all duration-300 ease-in-out shrink-0 flex bg-white dark:bg-gray-950 shadow-sm z-20",
				isMobile
					? "flex-col w-full border-b"
					: "flex-row h-full border-r",
			)}
		>
			{/* 觸發器：顯示標題與開關圖標 */}
			<Collapsible.Trigger asChild>
				<button
					title={sidebarOpen ? `收起面板 (${modifier} + B)` : `展開面板 (${modifier} + B)`}
					className={cn(
						"flex items-center justify-between shrink-0 cursor-pointer transition-all select-none outline-none border-border",
						"bg-gray-50/50 dark:bg-gray-900/50 hover:bg-blue-500/5 active:bg-blue-500/10",
						isMobile
							? "flex-row px-4 py-2 w-full border-b"
							: "flex-col py-6 px-1.5 w-10 border-r h-full group",
					)}
				>
					<Flex
						align="center"
						direction={isMobile ? "row" : "column"}
						gap="4"
						className={cn(!isMobile && "h-full justify-center")}
					>
						{/* 文字標籤區：確保在直向模式下圖標與文字不換列 */}
						<Flex
							direction={isMobile ? "row" : "column"}
							align="center"
							gap="2"
							className="whitespace-nowrap shrink-0"
						>
							<InfoCircledIcon className="text-blue-500 shrink-0" />
							<Text
								size="1"
								weight="bold"
								className={cn(
									"text-gray-500 tracking-widest whitespace-nowrap",
									!isMobile && "[writing-mode:vertical-lr]",
								)}
							>
								基本資料面板
							</Text>
						</Flex>
					</Flex>

					{/* 開關方向圖標 */}
					<Box className={cn(!isMobile && "mt-auto mb-2 opacity-50")}>
						{isMobile
							? (
								sidebarOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
							)
							: (
								sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />
							)}
					</Box>
				</button>
			</Collapsible.Trigger>

			{/* 內容區：渲染實際的 BasicInfoPanel */}
			<Collapsible.Content
				className={cn(
					"overflow-hidden transition-all duration-300 ease-in-out bg-white dark:bg-gray-950",
					isMobile
						? "data-[state=closed]:h-0 data-[state=open]:h-auto w-full"
						: "data-[state=closed]:w-0 data-[state=open]:w-72 h-full",
				)}
			>
				<Box
					className={cn(
						"p-4 transition-all",
						isMobile ? "w-full max-h-[50vh] overflow-y-auto" : "w-72 h-full overflow-y-auto",
					)}
				>
					<BasicInfoPanel />
				</Box>
			</Collapsible.Content>
		</Collapsible.Root>
	);
};
