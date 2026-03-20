import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/src/lib/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible";
import { DiagnosticPanel } from "./diagnostic-panel";
import { useHotkeys } from "react-hotkeys-hook";
import { cn, getModifierKey } from "@/src/lib/utils";

/**  Bottom Diagnostic Panel */
export const BottomDiagnosticPanel: React.FC = () => {
	const isMobile = useIsMobile();
	const [diagnosticOpen, setDiagnosticOpen] = useState(!isMobile);
	const modifier = getModifierKey();
	const title = `切換 摘要面板 ( ${modifier}+J 或 \` )`;

	// 快捷鍵：同時支援 mod+j 和 mod+`
	// mod 在 Mac 會自動對應 Cmd，在 Windows 會對應 Ctrl
	/**
	 * 如果有機會，改成 ctrl+`
	 * 但目前因為以下 bug 只能用 `
	 * https://github.com/JohannesKlauss/react-hotkeys-hook/issues/1300
	 */
	useHotkeys("`", (e) => {
		e.preventDefault();
		setDiagnosticOpen(prev => !prev);
	}, { useKey: true });

	// OK
	useHotkeys("mod+j", (e) => {
		e.preventDefault();
		setDiagnosticOpen(prev => !prev);
	});

	return (
		<Collapsible
			open={diagnosticOpen}
			onOpenChange={setDiagnosticOpen}
			className="flex flex-col border-t border-border bg-card/50 shrink-0"
		>
			<CollapsibleTrigger asChild>
				<button
					title={title}
					className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30 w-full text-left cursor-pointer hover:bg-indigo-500/10 active:bg-indigo-500/20 transition-colors group select-none outline-none"
				>
					<div className="flex items-center gap-3">
						<span className="font-semibold text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors group-hover:text-indigo-500">
							狀態摘要 / Summary
						</span>

						{/* 快捷鍵提示 - 僅在桌面版顯示 */}
						{!isMobile && (
							<div className="flex gap-1">
								<kbd className="pointer-events-none flex h-4 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[9px] font-medium text-muted-foreground">
									<span>{modifier} J</span>
								</kbd>
								<span className="text-[10px] text-muted-foreground/50">or</span>
								<kbd className="pointer-events-none flex h-4 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[9px] font-medium text-muted-foreground">
									<span>`</span>
								</kbd>
							</div>
						)}
					</div>

					<div className="shrink-0">
						{diagnosticOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" /> : <ChevronUp className="h-4 w-4 text-indigo-500 animate-pulse" />}
					</div>
				</button>
			</CollapsibleTrigger>

			<CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:h-0 data-[state=open]:h-auto">
				<div
					className={cn(
						"p-4 overflow-y-auto",
						isMobile ? "max-h-[50vh]" : "max-h-[40vh]",
					)}
				>
					<DiagnosticPanel />
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};
