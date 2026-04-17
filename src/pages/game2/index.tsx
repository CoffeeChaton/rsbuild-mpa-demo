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
import { ConfigProvider } from "../../common/context/ConfigProvider";
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
		<ConfigProvider namespace="game2">
			<div className="grid h-[calc(100vh-50px)] grid-rows-[auto_1fr_auto] overflow-hidden bg-gray-50 dark:bg-gray-950">
				<AppHeader />

				<ArsenalProvider>
					<div
						className={`grid min-h-0 overflow-hidden ${isMobile ? "grid-cols-1" : "grid-cols-[auto_1fr]"}`}
					>
						<div className="flex h-full min-h-0 flex-col">
							<LeftSidebar />
						</div>

						<div className="grid min-h-0 min-w-0 grid-rows-[1fr_auto] overflow-hidden">
							<div className="relative h-full min-h-0 overflow-hidden">
								<TableArea />
							</div>
							<BottomDiagnosticPanel />
						</div>
					</div>
				</ArsenalProvider>

				<AppFooter />
			</div>
		</ConfigProvider>
	);
};
