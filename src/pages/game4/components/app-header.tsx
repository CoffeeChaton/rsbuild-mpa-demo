import { Button } from "@/src/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Calculator, Moon, Settings, Sun } from "lucide-react";
import type { JSX } from "react/jsx-runtime";

export const AppHeader = (): JSX.Element => {
	return (
		<header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="flex items-center justify-between h-14 px-4">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary">
						<Calculator className="h-4 w-4" />
					</div>
					<div className="flex flex-col">
						<h1 className="text-sm font-semibold tracking-tight">
							練度規劃表
						</h1>
						<span className="text-[10px] text-muted-foreground uppercase tracking-wider">
							Arknights Planner
						</span>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0"
							>
								<Settings className="h-4 w-4" />
								<span className="sr-only">設定</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<Sun className="h-4 w-4 mr-2" />
								淺色主題
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Moon className="h-4 w-4 mr-2" />
								深色主題
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
};
