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
 */

import * as React from "react";
import { AppHeader } from "./components/app-header";
import { AppFooter } from "./components/app-footer";
import { ArsenalProvider } from "../game2/context/ArsenalContext";
import { LeftSidebar } from "./components/left-sidebar";
import { BottomDiagnosticPanel } from "./components/bottom-diagnostic-panel";
import { TableArea } from "../game2/components/TableArea";
import { useIsMobile } from "@/src/lib/use-mobile";

export const App: React.FC = () => {
	const isMobile = useIsMobile();

	return (
		<div // 還有一個 外部 AI 看不太到的 Navbar 佔據了 頂部高度 避免滾動條跑來跑去，大約要扣 50px
		 className="grid h-[calc(100vh-50px)] grid-rows-[auto_1fr_auto] overflow-hidden bg-gray-50 dark:bg-gray-950">
			{/* 1. 頂部標題與導航 */}
			<AppHeader />

			{/* 2. 核心計算引擎與布局 */}
			<ArsenalProvider>
				<div
					className={`grid min-h-0 overflow-hidden ${isMobile ? "grid-cols-1" : "grid-cols-[auto_1fr]"}`}
				>
					{/* 左側側邊欄 */}
					<div className="flex flex-col min-h-0 h-full">
						<LeftSidebar />
					</div>

					{/* 右側主內容區 */}
					<div className="grid min-h-0 min-w-0 grid-rows-[1fr_auto] overflow-hidden">
						{/* Table 區域：確保 h-full 以便 TableArea 內的 Box h-full 能生效 */}
						<div className="min-h-0 overflow-hidden h-full relative">
							<TableArea />
						</div>

						{/* Bottom Panel */}
						<BottomDiagnosticPanel />
					</div>
				</div>
			</ArsenalProvider>

			{/* 3. 頁尾資訊 */}
			<AppFooter />
		</div>
	);
};
