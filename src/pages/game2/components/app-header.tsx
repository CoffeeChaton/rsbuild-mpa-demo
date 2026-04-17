import * as React from "react";
import { memo } from "react";
import { Flex } from "@radix-ui/themes";
import { PlannerConfigSwitch } from "../../../common/components/PlannerConfigSwitch";

/**
 * AppHeader
 *
 * 靜態頂部導航欄。
 * 使用 memo 避免在全域狀態（如 ArsenalProvider）更新時觸發無謂的重新渲染。
 */
export const AppHeader: React.FC = memo(() => {
	return (
		<header
			style={{
				backgroundColor: "var(--slate-1)",
				borderBottom: "1px solid var(--slate-6)",
			}}
			className="sticky top-0 z-50 px-6 py-4 bg-opacity-80"
		>
			<Flex align="center" justify="between">
				<PlannerConfigSwitch />
			</Flex>
		</header>
	);
});

AppHeader.displayName = "AppHeader";
