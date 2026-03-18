// @file src/common/Navbar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Flex, TabNav, Text } from "@radix-ui/themes";
import { PAGE_MAP, type TPageKey } from "./config/pages";
import { VIEW_MAP } from "./router/view-map";
import { ConfigSwitch } from "./components/ConfigSwitch";

export const Navbar: React.FC = () => {
	const location = useLocation();

	const navItems = (Object.keys(PAGE_MAP) as TPageKey[])
		.filter((key) => !PAGE_MAP[key].hidden)
		.map((key) => ({
			key,
			path: key === "index" ? "/" : `/${key}/`,
			label: PAGE_MAP[key].label,
		}));

	// 正規化路徑比對
	const currentPath = location.pathname.replace(/\/+$/, "") || "/";

	return (
		<Box className="shrink-0 border-b border-(--gray-5) bg-(--gray-1)">
			<Flex align="center" px="4" gap="6" className="h-12">
				{/* Logo 區域 */}
				<Text
					size="4"
					weight="bold"
					color="indigo"
					className="select-none tracking-tight"
				>
					DEMO
				</Text>

				{/* 導覽連結 */}
				<TabNav.Root className="h-full border-b-0">
					{navItems.map((item) => {
						const target = item.path.replace(/\/+$/, "") || "/";
						const isActive = currentPath === target;

						return (
							<TabNav.Link
								asChild
								key={item.key}
								active={isActive}
								onMouseEnter={() => {
									const page = VIEW_MAP[item.key as keyof typeof VIEW_MAP];
									page?.loader?.();
								}}
								className="transition-colors"
							>
								<Link to={item.path} className="flex items-center" prefetch="intent">
									{item.label}
								</Link>
							</TabNav.Link>
						);
					})}
				</TabNav.Root>

				{/* 右側：帳號切換 */}
				<Flex ml="auto" align="center">
					<ConfigSwitch />
				</Flex>
			</Flex>
		</Box>
	);
};
