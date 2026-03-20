import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/src/lib/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible";
import { DiagnosticPanel } from "./diagnostic-panel";

/**  Bottom Diagnostic Panel */
export const BottomDiagnosticPanel: React.FC = () => {
	const isMobile = useIsMobile();
	const [diagnosticOpen, setDiagnosticOpen] = useState(() => !isMobile);

	return (
		<Collapsible
			open={diagnosticOpen}
			onOpenChange={setDiagnosticOpen}
			className="flex flex-col border-t border-border bg-card/50 shrink-0"
		>
			<CollapsibleTrigger asChild>
				<button className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50 w-full text-left cursor-pointer hover:bg-secondary/70 transition-colors">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
							Diagnostic / 診斷
						</span>
					</div>
					<div className="shrink-0">
						{diagnosticOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
					</div>
					<span className="sr-only">Toggle diagnostics</span>
				</button>
			</CollapsibleTrigger>

			<CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:h-0 data-[state=open]:h-auto">
				<div className="p-4">
					<DiagnosticPanel />
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};
