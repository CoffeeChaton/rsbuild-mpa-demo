// @file src/common/Navbar.tsx
import React, { useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router";
import { Box, Flex, TabNav, Text } from "@radix-ui/themes";
import { PAGE_MAP, type TPageKey } from "./config/pages";
import { VIEW_MAP } from "./router/view-map";
import { AppThemeSwitch } from "./components/AppThemeSwitch";

interface INavItemProps {
	item: { key: string, path: string, label: string };
	isActive: boolean;
}

const NavItem: React.FC<INavItemProps> = React.memo(({ item, isActive }) => {
	const handleMouseEnter = useCallback(() => {
		const page = VIEW_MAP[item.key as keyof typeof VIEW_MAP];
		if (page) {
			void page.loader();
		}
	}, [item.key]);

	return (
		<TabNav.Link
			asChild
			active={isActive}
			onMouseEnter={handleMouseEnter}
			className="transition-colors"
		>
			<Link to={item.path} className="flex items-center" prefetch="intent">
				{item.label}
			</Link>
		</TabNav.Link>
	);
});

NavItem.displayName = "NavItem";

export const Navbar: React.FC = () => {
	const location = useLocation();

	const navItems = useMemo(() =>
		(Object.keys(PAGE_MAP) as TPageKey[])
			.filter((key) => !PAGE_MAP[key].hidden)
			.map((key) => ({
				key,
				path: key === "index" ? "/" : `/${key}/`,
				label: PAGE_MAP[key].label,
			})), []);

	// 正規化路徑比對
	const currentPath = useMemo(() => location.pathname.replace(/\/+$/, "") || "/", [location.pathname]);

	return (
		<Box className="shrink-0 border-b border-(--gray-5) bg-(--gray-1)">
			<Flex align="center" px="3" gap="3" className="h-12 min-w-0">
				<Text
					size="4"
					weight="bold"
					color="indigo"
					className="select-none tracking-tight shrink-0"
				>
					DEMO
				</Text>

				<Box className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					<TabNav.Root className="h-full min-w-max border-b-0 pr-2">
						{navItems.map((item) => (
							<NavItem
								key={item.key}
								item={item}
								isActive={currentPath === (item.path.replace(/\/+$/, "") || "/")}
							/>
						))}
					</TabNav.Root>
				</Box>

				<Flex align="center" className="shrink-0">
					<AppThemeSwitch />
				</Flex>
			</Flex>
		</Box>
	);
};
