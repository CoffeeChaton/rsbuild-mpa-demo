/**
 * Game4 頁面主入口 (Arknights Planner V4)
 *
 * 預期布局行為：
 * 1. 頂部導航欄 (AppHeader)
 * 2. 中間內容區 (ArsenalProvider 封裝)：
 *    - 左側：基本資料面板 (LeftSidebar > BasicInfoPanel)，提供庫存與產能數據 (數據源頭)
 *    - 中間：核心需求表格 (TableArea)，處理角色列表與資源計算 (核心邏輯)
 *    - 底部：診斷與摘要面板 (BottomDiagnosticPanel > DiagnosticPanel)，顯示最終計算結果 (數據終點)
 * 3. 底部版權欄 (AppFooter)
 *
 * 數據流向 (Data Flow):
 * BasicInfoPanel (Inventory) -> TableArea (Items & Calculations) -> DiagnosticPanel (Results)
 */

import * as React from "react";
import { Box, Flex } from "@radix-ui/themes";
import { AppHeader } from "./components/app-header";
import { AppFooter } from "./components/app-footer";
import { ArsenalProvider } from "../game2/context/ArsenalContext";
import { LeftSidebar } from "./components/left-sidebar";
import { BottomDiagnosticPanel } from "./components/bottom-diagnostic-panel";
import { TableArea } from "../game2/components/TableArea";

export const App: React.FC = () => {
	return (
		<Flex direction="column" className="overflow-hidden bg-gray-50 dark:bg-gray-950" style={{ height: `calc(100vh - 50px)` }}>
			{/* 1. 頂部標題與導航 */}
			<AppHeader />

			{/* 2. 核心計算引擎與布局 */}
			<ArsenalProvider>
				<Flex className="flex-1 min-h-0 overflow-hidden" direction={{ initial: "column", lg: "row" }}>
					{/* 左側側邊欄：輸入庫存與產能 (數據源) */}
					<LeftSidebar />

					{/* 主內容區：核心表格與底部摘要 */}
					<Flex direction="column" className="flex-1 min-w-0 min-h-0 overflow-hidden relative">
						{/* 中央表格區域：管理角色與顯示計算結果 */}
						<Box className="flex-1 min-h-0 bg-white dark:bg-gray-900 overflow-hidden">
							<TableArea />
						</Box>

						{/* 底部摘要面板：顯示診斷、進度與預估天數 (數據終點) */}
						<BottomDiagnosticPanel />
					</Flex>
				</Flex>
			</ArsenalProvider>

			{/* 3. 頁尾資訊 */}
			<AppFooter />
		</Flex>
	);
};
