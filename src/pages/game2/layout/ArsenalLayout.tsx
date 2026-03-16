// src/pages/game2/layout/ArsenalLayout.tsx
import React from "react";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { InventoryCard } from "../components/InventoryCard";
import { TableArea } from "../components/TableArea";
import { Toolbar } from "../components/Toolbar";
import { ConfigSwitch } from "../components/ConfigSwitch";
import { Head } from "../components/Head";
import { NAV_BAR_HEIGHT } from "../config/constants";
import { DiagnosticPanel } from "../components/DiagnosticPanel";
import { ArsenalProvider } from "../context/ArsenalContext";
import { ConfigProvider } from "../context/ConfigProvider";

/**
 * ArsenalLayout
 *
 * 負責：
 * - Page Layout
 * - 組合 UI
 */

export const ArsenalLayout: React.FC = () => {
	return (
		<ConfigProvider>
			<ArsenalProvider>
				<Box
					p={{ initial: "2", sm: "4" }}
					style={{
						height: `calc(100vh - ${NAV_BAR_HEIGHT}px)`,
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
						background: "var(--gray-2)",
					}}
				>
					{/* 配置切換工具列 */}
					<Flex gap="3" align="center" mb="3" wrap="wrap">
						<Head />
						<ConfigSwitch />
						<Toolbar />
					</Flex>

					<Grid
						columns={{ initial: "1", lg: "320px 1fr" }}
						gap="4"
						style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
					>
						{/* 左側卡片 (RWD: Mobile 上面, Desktop 左邊) */}
						<Box style={{ overflowY: "auto", minHeight: 0 }} className="h-full lg:h-auto">
							<InventoryCard />
						</Box>

						{/* 主要表格區塊 */}
						<Flex direction="column" gap="3" style={{ overflow: "hidden", minHeight: 0 }}>
							<TableArea />
						</Flex>
					</Grid>

					{/* 診斷列 (固定在底部，不隨內容滾動) */}
					<DiagnosticPanel />
				</Box>
			</ArsenalProvider>
		</ConfigProvider>
	);
};
