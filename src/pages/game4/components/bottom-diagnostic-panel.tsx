import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useState } from "react";
import { useIsMobile } from "@/src/lib/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible";
import { DiagnosticPanel } from "./diagnostic-panel";
import { useHotkeys } from "react-hotkeys-hook";
import { cn, getModifierKey } from "@/src/lib/utils";
import { useResizableHeight } from "../hooks/UseResizableHeightProps";

const HEIGHT_KEY = "diagnostic-height";

export const BottomDiagnosticPanel: React.FC = () => {
	const isMobile = useIsMobile();
	const modifier = getModifierKey();
	const [open, setOpen] = useState(!isMobile);

	const { height, panelRef, startResizing } = useResizableHeight({
		key: HEIGHT_KEY,
		defaultHeight: 260,
		minHeight: 160,
		maxHeight: 600,
		isMobile,
	});

	// 快捷鍵邏輯
	const toggle = useCallback(() => setOpen((prev) => !prev), []);

	// 快捷鍵

	useHotkeys("`", e => {
		e.preventDefault();
		toggle();
	}, { useKey: true });

	useHotkeys("mod+j", e => {
		e.preventDefault();
		toggle();
	});

	return (
		<Collapsible
			open={open}
			onOpenChange={setOpen}
			className="flex flex-col border-t border-border bg-card/50 shrink-0"
		>
			{/* Desktop only resize handle */}
			{open && !isMobile && (
				<div
					onMouseDown={startResizing}
					className="h-1 w-full cursor-row-resize bg-transparent hover:bg-indigo-500/30 transition-colors"
				/>
			)}

			<CollapsibleTrigger asChild>
				<button
					title={`切換 摘要面板 (${modifier}+J 或 \`)`}
					className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30 w-full text-left cursor-pointer hover:bg-indigo-500/10 active:bg-indigo-500/20 transition-colors group select-none outline-none"
				>
					<div className="flex items-center gap-3">
						<span className="font-semibold text-[11px] uppercase tracking-[0.15em] text-muted-foreground group-hover:text-indigo-500">
							狀態摘要 / Summary
						</span>

						{!isMobile && (
							<div className="flex gap-1">
								<kbd className="h-4 rounded border border-border bg-muted px-1.5 font-mono text-[9px] text-muted-foreground">{modifier} J</kbd>
								<span className="text-[10px] text-muted-foreground/50">or</span>
								<kbd className="h-4 rounded border border-border bg-muted px-1.5 font-mono text-[9px] text-muted-foreground">`</kbd>
							</div>
						)}
					</div>

					<div>
						{open
							? (
								<div className="flex items-center gap-2">
									<span className="text-[10px] text-indigo-500 font-medium animate-pulse">收起</span>
									<ChevronDown className="h-4 w-4 opacity-50 transition-transform group-hover:translate-y-0.5" />
								</div>
							)
							: (
								<div className="flex items-center gap-2">
									<span className="text-[10px] text-indigo-500 font-medium animate-pulse">展開</span>
									<ChevronUp className="h-4 w-4 text-indigo-500 animate-bounce" />
								</div>
							)}
					</div>
				</button>
			</CollapsibleTrigger>

			<CollapsibleContent
				className={cn(
					"overflow-hidden",
					"data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-2 data-[state=open]:duration-300",
					"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-2 data-[state=closed]:duration-200",
				)}
			>
				<div
					ref={panelRef}
					style={{ height: isMobile ? "50vh" : height }}
					className="overflow-y-auto p-4 transition-[height] duration-200"
				>
					<DiagnosticPanel />
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};
