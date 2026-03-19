import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { JSX } from "react/jsx-runtime";

export const AppFooter = (): JSX.Element => {
	return (
		<footer className="border-t border-border bg-secondary/30">
			<div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
				<div className="flex items-center gap-4 text-xs text-muted-foreground">
					<span>明日方舟 練度規劃表</span>
					<span className="hidden sm:inline">|</span>
					<span className="hidden sm:inline">
						資料來源:MooncellWiki / ArknightsToolbox
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
						asChild
					>
						<a
							href="https://github.com/CoffeeChaton/rsbuild-mpa-demo"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Github className="h-3.5 w-3.5" />
							GitHub
						</a>
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
						asChild
					>
						<a
							href="https://prts.wiki"
							target="_blank"
							rel="noopener noreferrer"
						>
							<ExternalLink className="h-3.5 w-3.5" />
							PRTS Wiki
						</a>
					</Button>
				</div>
			</div>
			<div className="px-4 py-2 border-t border-border/50 text-center">
				<p className="text-[10px] text-muted-foreground/70">
					本項目所使用的遊戲資源版權屬於上海鷹角網絡科技有限公司
				</p>
			</div>
		</footer>
	);
};
