import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Flex, Heading, TabNav } from "@radix-ui/themes";
import { PAGE_MAP, type TPageKey } from "./config/pages";

export const Navbar: React.FC = () => {
	const location = useLocation();

	const navItems = (Object.keys(PAGE_MAP) as TPageKey[])
		.filter((key) => !PAGE_MAP[key].hidden)
		.map((key) => ({
			key,
			path: key === "index" ? "/" : `/${key}/`,
			label: PAGE_MAP[key].label,
		}));

	const currentPath = location.pathname.replace(/\/+$/, "") || "/";

	return (
		<TabNav.Root color="indigo" size="2">
			<Flex align="center" gap="4" px="4">
				{/* Logo 區域 */}
				<Heading size="4" weight="bold" color="indigo">DEMO</Heading>

				{/* 導覽連結 */}
				{navItems.map((item) => {
					const target = item.path.replace(/\/+$/, "") || "/";
					const isActive = currentPath === target;

					return (
						<TabNav.Link
							asChild
							key={item.key}
							active={isActive}
						>
							<Link
								to={item.path}
								prefetch="intent" // RR7 預載關鍵字
							>
								{item.label}
							</Link>
						</TabNav.Link>
					);
				})}
			</Flex>
		</TabNav.Root>
	);
};
