import React from "react";
import { Link, useLocation } from "react-router-dom";
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
		<nav className="flex items-center gap-6 px-4 h-12 border-b bg-white">
			{/* Logo 區域 */}
			<div
				className="text-lg font-[900] text-indigo-600 tracking-tight"
				style={{ fontWeight: 900 }}
			>
				DEMO
			</div>

			{/* 導覽連結 */}
			<div className="flex h-full gap-4">
				{navItems.map((item) => {
					const target = item.path.replace(/\/+$/, "") || "/";
					const isActive = currentPath === target;

					return (
						<Link
							key={item.key}
							to={item.path}
							prefetch="intent" // RR7 原生支援：滑鼠移入時觸發異步資源預載
							className={`
                relative flex items-center px-1 text-sm font-medium transition-colors h-full
                ${isActive ? "text-indigo-600" : "text-gray-500 hover:text-indigo-500"}
              `}
						>
							{item.label}
							{/* Active 底線 */}
							{isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
						</Link>
					);
				})}
			</div>
		</nav>
	);
};
