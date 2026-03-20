import { cn } from "@/src/lib/utils";
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible";
import { useIsMobile } from "@/src/lib/use-mobile";
import { BasicInfoPanel } from "./basic-info-panel";

const SIDEBAR_KEY = "sidebarOpen";

export const LeftSidebar: React.FC = () => {
	const isMobile = useIsMobile();

	const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
		if (typeof window === "undefined") return true;

		const saved = localStorage.getItem(SIDEBAR_KEY);
		if (saved !== null) return saved === "true";

		// fallback：桌面開、手機關
		return !isMobile;
	});

	useEffect(() => {
		localStorage.setItem(SIDEBAR_KEY, String(sidebarOpen));
	}, [sidebarOpen]);

	return (
		<Collapsible
			open={sidebarOpen}
			onOpenChange={setSidebarOpen}
			className={cn(
				"border-border bg-sidebar transition-all duration-300 ease-in-out shrink-0 flex",
				isMobile
					? "flex-col w-full border-b"
					: "flex-row h-full border-r",
			)}
		>
			<CollapsibleTrigger asChild>
				<button
					title={sidebarOpen ? "收起側邊欄" : "展開側邊欄"} // ✅ tooltip
					className={cn(
						"flex items-center justify-between shrink-0 cursor-pointer transition-all select-none outline-none",
						"bg-secondary/10 hover:bg-indigo-500/10 active:bg-indigo-500/20",
						isMobile
							? "flex-row px-4 py-3 w-full border-b border-border"
							: "flex-col py-6 px-2 w-10 border-r border-border h-full group",
					)}
				>
					<div
						className={cn(
							"flex items-center",
							!isMobile && "flex-col h-full w-full justify-center",
						)}
					>
						<span
							className={cn(
								"font-medium text-[14px] text-muted-foreground whitespace-nowrap",
								"transition-all duration-300",
								!isMobile && "[writing-mode:vertical-lr] tracking-wider text-indigo-600 dark:text-indigo-400",
							)}
						>
							基本資料
						</span>
					</div>

					<div
						className={cn(
							"shrink-0 flex items-center justify-center",
							!isMobile && "mt-auto mb-2",
						)}
					>
						{/* Desktop */}
						<span className="hidden lg:inline">
							{sidebarOpen ? <ChevronLeft className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" /> : <ChevronRight className="h-4 w-4 text-indigo-500 animate-pulse" />}
						</span>

						{/* Mobile */}
						<span className="lg:hidden">
							{sidebarOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
						</span>
					</div>
				</button>
			</CollapsibleTrigger>

			<CollapsibleContent
				className={cn(
					"overflow-hidden transition-all duration-300 ease-in-out",
					isMobile
						? "data-[state=closed]:h-0 data-[state=open]:h-auto w-full"
						: "data-[state=closed]:w-0 data-[state=open]:w-72 h-full",
				)}
			>
				<div
					className={cn(
						"transition-all",
						isMobile
							? "w-full p-2 max-h-[calc(100vh-120px)] overflow-y-auto" // 手機版：減少 padding 增加寬度感
							: "w-72 h-full p-4 overflow-y-auto", // 桌面版：維持固定寬度
					)}
				>
					<BasicInfoPanel />
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};
