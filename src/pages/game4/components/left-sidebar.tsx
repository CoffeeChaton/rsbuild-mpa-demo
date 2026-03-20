import { cn } from "@/src/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible";
import { useIsMobile } from "@/src/lib/use-mobile";
import { BasicInfoPanel } from "./basic-info-panel";

/* Left Sidebar - Basic Info (Desktop: horizontal collapsible, Mobile: vertical) */
export const LeftSidebar: React.FC = () => {
	const isMobile = useIsMobile();
	const [sidebarOpen, setSidebarOpen] = useState(() => !isMobile);

	return (
		<Collapsible
			open={sidebarOpen}
			onOpenChange={setSidebarOpen}
			className={cn(
				"border-border bg-sidebar transition-all duration-300 ease-in-out shrink-0",
				// "lg:flex lg:flex-row lg:border-r",
				// "flex flex-col border-b lg:border-b-0",
			)}
		>
			{/* Desktop: Sidebar Header (vertical strip) - entire area clickable */}
			<CollapsibleTrigger asChild>
				<button
					className={cn(
						"flex items-center justify-between bg-secondary/50 shrink-0 cursor-pointer",
						"hover:bg-secondary/70 transition-colors",
						"lg:flex-col lg:py-4 lg:px-2 lg:border-r lg:border-border",
						"flex-row px-4 py-3 border-b border-border lg:border-b-0",
						"w-full text-left",
					)}
				>
					<div className="flex items-center gap-2 lg:flex-col">
						<span
							className={cn(
								// "font-semibold text-xs uppercase tracking-wider text-muted-foreground",
								// "lg:[writing-mode:vertical-lr] lg:rotate-180",
							)}
						>
							基本資料
						</span>
					</div>
					<div className="shrink-0">
						{/* Desktop icons */}
						<span className="hidden lg:inline">
							{sidebarOpen ? <ChevronLeft className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
						</span>
						{/* Mobile icons */}
						<span className="lg:hidden">
							{sidebarOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
						</span>
					</div>
					<span className="sr-only">Toggle sidebar</span>
				</button>
			</CollapsibleTrigger>

			<CollapsibleContent
				className={cn(
					"overflow-hidden",
					"data-[state=open]:animate-in data-[state=closed]:animate-out",
					"lg:data-[state=closed]:w-0 lg:data-[state=open]:w-70",
					"data-[state=closed]:h-0 data-[state=open]:h-auto lg:data-[state=open]:h-auto",
				)}
			>
				<div className="p-4 lg:h-full lg:overflow-y-auto max-h-[40vh] lg:max-h-none overflow-y-auto">
					<BasicInfoPanel />
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};
