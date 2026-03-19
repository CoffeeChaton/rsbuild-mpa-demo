"use client";

import * as React from "react";
import { GripVertical, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/src/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import type { JSX } from "react/jsx-runtime";

interface OperatorRow {
	id: string;
	enabled: boolean;
	rarity: number;
	name: string;
	profession: string;
	elite: number;
	eliteTarget: number;
	skillLevel: number;
	skillTarget: number;
	skill1Mastery: number;
	skill2Mastery: number;
	skill3Mastery: number;
	note: string;
	levelFrom: number;
	levelTo: number;
	estimatedLmd: number;
	estimatedExp: number;
	skillBooks: number;
	chipPacks: number;
	cumulativeLmd: number;
	cumulativeExp: number;
	priority: "high" | "medium" | "low";
}

const professions = ["先鋒", "近衛", "重裝", "狙擊", "術師", "醫療", "輔助", "特種"];

const mockOperators: OperatorRow[] = [
	{
		id: "1",
		enabled: true,
		rarity: 6,
		name: "陳",
		profession: "近衛",
		elite: 2,
		eliteTarget: 2,
		skillLevel: 7,
		skillTarget: 7,
		skill1Mastery: 0,
		skill2Mastery: 3,
		skill3Mastery: 3,
		note: "主力",
		levelFrom: 80,
		levelTo: 90,
		estimatedLmd: 150000,
		estimatedExp: 120000,
		skillBooks: 24,
		chipPacks: 0,
		cumulativeLmd: 150000,
		cumulativeExp: 120000,
		priority: "high",
	},
	{
		id: "2",
		enabled: true,
		rarity: 6,
		name: "銀灰",
		profession: "近衛",
		elite: 2,
		eliteTarget: 2,
		skillLevel: 7,
		skillTarget: 7,
		skill1Mastery: 0,
		skill2Mastery: 0,
		skill3Mastery: 3,
		note: "練度優先",
		levelFrom: 70,
		levelTo: 90,
		estimatedLmd: 280000,
		estimatedExp: 250000,
		skillBooks: 36,
		chipPacks: 0,
		cumulativeLmd: 430000,
		cumulativeExp: 370000,
		priority: "high",
	},
	{
		id: "3",
		enabled: true,
		rarity: 5,
		name: "德克薩斯",
		profession: "先鋒",
		elite: 1,
		eliteTarget: 2,
		skillLevel: 7,
		skillTarget: 7,
		skill1Mastery: 0,
		skill2Mastery: 3,
		skill3Mastery: 0,
		note: "",
		levelFrom: 60,
		levelTo: 80,
		estimatedLmd: 95000,
		estimatedExp: 85000,
		skillBooks: 18,
		chipPacks: 4,
		cumulativeLmd: 525000,
		cumulativeExp: 455000,
		priority: "medium",
	},
	{
		id: "4",
		enabled: false,
		rarity: 5,
		name: "藍毒",
		profession: "狙擊",
		elite: 1,
		eliteTarget: 2,
		skillLevel: 5,
		skillTarget: 7,
		skill1Mastery: 0,
		skill2Mastery: 0,
		skill3Mastery: 0,
		note: "二隊",
		levelFrom: 50,
		levelTo: 70,
		estimatedLmd: 72000,
		estimatedExp: 65000,
		skillBooks: 12,
		chipPacks: 4,
		cumulativeLmd: 597000,
		cumulativeExp: 520000,
		priority: "medium",
	},
	{
		id: "5",
		enabled: true,
		rarity: 4,
		name: "香草",
		profession: "先鋒",
		elite: 0,
		eliteTarget: 1,
		skillLevel: 4,
		skillTarget: 7,
		skill1Mastery: 0,
		skill2Mastery: 0,
		skill3Mastery: 0,
		note: "基建",
		levelFrom: 1,
		levelTo: 55,
		estimatedLmd: 45000,
		estimatedExp: 40000,
		skillBooks: 8,
		chipPacks: 2,
		cumulativeLmd: 642000,
		cumulativeExp: 560000,
		priority: "low",
	},
	{
		id: "6",
		enabled: false,
		rarity: 6,
		name: "艾雅法拉",
		profession: "術師",
		elite: 2,
		eliteTarget: 2,
		skillLevel: 7,
		skillTarget: 7,
		skill1Mastery: 0,
		skill2Mastery: 3,
		skill3Mastery: 3,
		note: "核心術師",
		levelFrom: 60,
		levelTo: 90,
		estimatedLmd: 320000,
		estimatedExp: 280000,
		skillBooks: 42,
		chipPacks: 0,
		cumulativeLmd: 962000,
		cumulativeExp: 840000,
		priority: "high",
	},
	{
		id: "7",
		enabled: true,
		rarity: 5,
		name: "白面鴞",
		profession: "醫療",
		elite: 1,
		eliteTarget: 2,
		skillLevel: 7,
		skillTarget: 7,
		skill1Mastery: 0,
		skill2Mastery: 0,
		skill3Mastery: 0,
		note: "主奶",
		levelFrom: 50,
		levelTo: 70,
		estimatedLmd: 85000,
		estimatedExp: 75000,
		skillBooks: 15,
		chipPacks: 4,
		cumulativeLmd: 1047000,
		cumulativeExp: 915000,
		priority: "medium",
	},
	{
		id: "8",
		enabled: true,
		rarity: 6,
		name: "推進之王",
		profession: "先鋒",
		elite: 2,
		eliteTarget: 2,
		skillLevel: 7,
		skillTarget: 7,
		skill1Mastery: 0,
		skill2Mastery: 3,
		skill3Mastery: 0,
		note: "速切先鋒",
		levelFrom: 40,
		levelTo: 90,
		estimatedLmd: 380000,
		estimatedExp: 340000,
		skillBooks: 48,
		chipPacks: 0,
		cumulativeLmd: 1427000,
		cumulativeExp: 1255000,
		priority: "high",
	},
];

function RarityStars({ rarity }: { rarity: number }) {
	return (
		<div className="flex items-center gap-0.5">
			{Array.from({ length: rarity }).map((_, i) => (
				<Star
					key={i}
					className="h-3 w-3 fill-accent text-accent"
				/>
			))}
		</div>
	);
}

function formatNumber(num: number): string {
	return num.toLocaleString("zh-TW");
}

export const OperatorTable = (): JSX.Element => {
	const [operators, setOperators] = React.useState<OperatorRow[]>(() => mockOperators);

	const addRow = () => {
		const newId = (operators.length + 1).toString();
		setOperators([
			...operators,
			{
				id: newId,
				enabled: true,
				rarity: 4,
				name: "",
				profession: "近衛",
				elite: 0,
				eliteTarget: 1,
				skillLevel: 1,
				skillTarget: 7,
				skill1Mastery: 0,
				skill2Mastery: 0,
				skill3Mastery: 0,
				note: "",
				levelFrom: 1,
				levelTo: 1,
				estimatedLmd: 0,
				estimatedExp: 0,
				skillBooks: 0,
				chipPacks: 0,
				cumulativeLmd: 0,
				cumulativeExp: 0,
				priority: "medium",
			},
		]);
	};

	// const toggleEnabled = (id: string) => {
	//   setOperators(
	//     operators.map((op) =>
	//       op.id === id ? { ...op, enabled: !op.enabled } : op
	//     )
	//   )
	// }

	const removeRow = (id: string) => {
		setOperators(operators.filter((op) => op.id !== id));
	};

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30 shrink-0">
				<div className="flex items-center gap-3">
					<h2 className="text-sm font-semibold uppercase tracking-wider">
						練度規劃列表
					</h2>
					<Badge variant="secondary" className="font-mono text-xs">
						{operators.length} 筆
					</Badge>
				</div>
				<Button onClick={addRow} size="sm" className="gap-1.5">
					<Plus className="h-3.5 w-3.5" />
					新增需求列
				</Button>
			</div>

			<div className="flex-1 min-h-0 overflow-auto">
				<Table className="min-w-[1400px]">
					<TableHeader className="sticky top-0 bg-card z-10">
						<TableRow className="border-border hover:bg-transparent">
							<TableHead className="w-10" />
							<TableHead className="w-12 text-center">應用</TableHead>
							<TableHead className="w-20 text-center">星級</TableHead>
							<TableHead className="min-w-[100px]">角色</TableHead>
							<TableHead className="w-20 text-center">職業</TableHead>
							<TableHead className="w-28 text-center">精英化</TableHead>
							<TableHead className="w-24 text-center">技能等級</TableHead>
							<TableHead className="w-28 text-center">專精 (1/2/3)</TableHead>
							<TableHead className="w-20 text-center">優先級</TableHead>
							<TableHead className="min-w-[80px]">備註</TableHead>
							<TableHead className="w-32 text-center">等級提升</TableHead>
							<TableHead className="w-24 text-right font-mono">預估錢</TableHead>
							<TableHead className="w-24 text-right font-mono">預估書</TableHead>
							<TableHead className="w-20 text-right font-mono">技能書</TableHead>
							<TableHead className="w-20 text-right font-mono">晶片</TableHead>
							<TableHead className="w-24 text-right font-mono">累計錢</TableHead>
							<TableHead className="w-24 text-right font-mono">累計書</TableHead>
							<TableHead className="w-16 text-center">操作</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{operators.length === 0
							? (
								<TableRow>
									<TableCell
										colSpan={18}
										className="h-32 text-center text-muted-foreground"
									>
										尚無資料，點擊「新增需求列」開始規劃
									</TableCell>
								</TableRow>
							)
							: (
								operators.map((op) => (
									<TableRow
										key={op.id}
										className={`border-border group hover:bg-muted/30 transition-opacity ${!op.enabled ? "opacity-40" : ""}`}
									>
										<TableCell className="text-muted-foreground">
											<GripVertical className="h-4 w-4 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
										</TableCell>
										<TableCell className="text-center">
											<input
												type="checkbox"
												checked={op.enabled}
												onChange={(e) => {
													setOperators((prev) => prev.map((o) => o.id === op.id ? { ...o, enabled: e.target.checked } : o));
												}}
												className="h-4 w-4 rounded border-border bg-input accent-primary cursor-pointer"
											/>
										</TableCell>
										<TableCell>
											<Select defaultValue={op.rarity.toString()}>
												<SelectTrigger className="h-8 w-full bg-input border-border">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{[6, 5, 4, 3, 2, 1].map((r) => (
														<SelectItem key={r} value={r.toString()}>
															<RarityStars rarity={r} />
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</TableCell>
										<TableCell>
											<Input
												defaultValue={op.name}
												placeholder="角色名稱"
												className="h-8 bg-input border-border"
											/>
										</TableCell>
										<TableCell>
											<Select defaultValue={op.profession}>
												<SelectTrigger className="h-8 w-full bg-input border-border text-xs">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{professions.map((p) => (
														<SelectItem key={p} value={p}>
															{p}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1 justify-center">
												<Select defaultValue={op.elite.toString()}>
													<SelectTrigger className="h-7 w-14 bg-input border-border text-xs font-mono">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{[0, 1, 2].map((e) => (
															<SelectItem key={e} value={e.toString()}>
																E{e}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<span className="text-muted-foreground text-xs">→</span>
												<Select defaultValue={op.eliteTarget.toString()}>
													<SelectTrigger className="h-7 w-14 bg-input border-border text-xs font-mono">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{[0, 1, 2].map((e) => (
															<SelectItem key={e} value={e.toString()}>
																E{e}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1 justify-center">
												<span className="font-mono text-xs">{op.skillLevel}</span>
												<span className="text-muted-foreground text-xs">→</span>
												<span className="font-mono text-xs text-primary">{op.skillTarget}</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-0.5 justify-center">
												<Badge
													variant={op.skill1Mastery > 0 ? "default" : "outline"}
													className="font-mono text-xs px-1 h-5"
												>
													M{op.skill1Mastery}
												</Badge>
												<Badge
													variant={op.skill2Mastery > 0 ? "default" : "outline"}
													className="font-mono text-xs px-1 h-5"
												>
													M{op.skill2Mastery}
												</Badge>
												<Badge
													variant={op.skill3Mastery > 0 ? "default" : "outline"}
													className="font-mono text-xs px-1 h-5"
												>
													M{op.skill3Mastery}
												</Badge>
											</div>
										</TableCell>
										<TableCell>
											<Select defaultValue={op.priority}>
												<SelectTrigger
													className={`h-7 w-16 border text-xs ${
														op.priority === "high"
															? "bg-destructive/20 border-destructive text-destructive"
															: op.priority === "medium"
															? "bg-warning/20 border-warning text-warning-foreground"
															: "bg-muted border-border"
													}`}
												>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="high">高</SelectItem>
													<SelectItem value="medium">中</SelectItem>
													<SelectItem value="low">低</SelectItem>
												</SelectContent>
											</Select>
										</TableCell>
										<TableCell>
											<Input
												defaultValue={op.note}
												placeholder="備註"
												className="h-8 bg-input border-border text-xs"
											/>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1.5 justify-center">
												<Input
													type="number"
													defaultValue={op.levelFrom}
													className="h-8 w-12 text-center bg-input border-border font-mono text-xs"
												/>
												<span className="text-muted-foreground">→</span>
												<Input
													type="number"
													defaultValue={op.levelTo}
													className="h-8 w-12 text-center bg-input border-border font-mono text-xs"
												/>
											</div>
										</TableCell>
										<TableCell className="text-right font-mono text-xs">
											{formatNumber(op.estimatedLmd)}
										</TableCell>
										<TableCell className="text-right font-mono text-xs">
											{formatNumber(op.estimatedExp)}
										</TableCell>
										<TableCell className="text-right font-mono text-xs text-accent">
											{formatNumber(op.skillBooks)}
										</TableCell>
										<TableCell className="text-right font-mono text-xs text-accent">
											{formatNumber(op.chipPacks)}
										</TableCell>
										<TableCell className="text-right font-mono text-xs text-primary">
											{formatNumber(op.cumulativeLmd)}
										</TableCell>
										<TableCell className="text-right font-mono text-xs text-primary">
											{formatNumber(op.cumulativeExp)}
										</TableCell>
										<TableCell className="text-center">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => removeRow(op.id)}
												className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
											>
												<Trash2 className="h-3.5 w-3.5" />
												<span className="sr-only">刪除</span>
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
