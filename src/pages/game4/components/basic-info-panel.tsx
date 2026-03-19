"use client";

import * as React from "react";
import { BookOpen, Coins, Download, Save, Upload } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Separator } from "@/src/components/ui/separator";
import { Label } from "@/src/components/ui/label";

export const BasicInfoPanel: React.FC = () => {
	const [lmd, setLmd] = React.useState("500000");
	const [expBooks, setExpBooks] = React.useState("0");
	const [lmdProduction, setLmdProduction] = React.useState("20000");
	const [expProduction, setExpProduction] = React.useState("10000");

	return (
		<div className="flex flex-col gap-4 h-full">
			{/* Save Slot Section */}
			<div className="space-y-3">
				<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
					<Save className="h-3.5 w-3.5" />
					<span>存檔管理</span>
				</div>
				<Select defaultValue="default">
					<SelectTrigger className="w-full bg-input border-border">
						<SelectValue placeholder="選擇存檔" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="default">預設存檔</SelectItem>
						<SelectItem value="slot1">存檔 1</SelectItem>
						<SelectItem value="slot2">存檔 2</SelectItem>
					</SelectContent>
				</Select>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" className="flex-1 text-xs">
						<Upload className="h-3 w-3 mr-1" />
						導入
					</Button>
					<Button variant="outline" size="sm" className="flex-1 text-xs">
						<Download className="h-3 w-3 mr-1" />
						導出
					</Button>
				</div>
			</div>

			<Separator className="bg-border" />

			{/* Inventory Section */}
			<div className="space-y-3">
				<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
					<Coins className="h-3.5 w-3.5" />
					<span>庫存資源</span>
				</div>
				<Card className="bg-card/50 border-border">
					<CardContent className="p-3 space-y-3">
						<div className="space-y-1.5">
							<Label htmlFor="lmd" className="text-xs text-muted-foreground">
								龍門幣
							</Label>
							<Input
								id="lmd"
								type="number"
								value={lmd}
								onChange={(e) => setLmd(e.target.value)}
								className="bg-input border-border h-8 text-sm font-mono"
							/>
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor="exp-books"
								className="text-xs text-muted-foreground"
							>
								作戰記錄合計
							</Label>
							<div className="flex items-center gap-2">
								<Input
									id="exp-books"
									type="number"
									value={expBooks}
									onChange={(e) => setExpBooks(e.target.value)}
									className="bg-input border-border h-8 text-sm font-mono"
								/>
								<span className="text-xs text-muted-foreground whitespace-nowrap">
									EXP
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Separator className="bg-border" />

			{/* Production Section */}
			<div className="space-y-3">
				<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
					<BookOpen className="h-3.5 w-3.5" />
					<span>每日產能</span>
				</div>
				<Card className="bg-card/50 border-border">
					<CardContent className="p-3 space-y-3">
						<div className="space-y-1.5">
							<Label
								htmlFor="lmd-production"
								className="text-xs text-muted-foreground"
							>
								龍門幣產出
							</Label>
							<Input
								id="lmd-production"
								type="number"
								value={lmdProduction}
								onChange={(e) => setLmdProduction(e.target.value)}
								className="bg-input border-border h-8 text-sm font-mono"
							/>
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor="exp-production"
								className="text-xs text-muted-foreground"
							>
								經驗書產出
							</Label>
							<Input
								id="exp-production"
								type="number"
								value={expProduction}
								onChange={(e) => setExpProduction(e.target.value)}
								className="bg-input border-border h-8 text-sm font-mono"
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
