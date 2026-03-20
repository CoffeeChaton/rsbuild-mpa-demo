import * as React from "react";
import { GripVertical, Plus, Star, Trash2 } from "lucide-react";
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
import { Button, Flex } from "@radix-ui/themes";
import { DownloadIcon, UploadIcon } from "@radix-ui/react-icons";

interface OperatorRow {
	id: string;
	enabled: boolean;
	rarity: number;
	name: string;
	note: string;
	e1: number;
	e2: number;
	l1: number;
	l2: number;
	estimatedLmd: number;
	estimatedExp: number;
	cumulativeLmd: number;
	cumulativeExp: number;
	priority: "high" | "medium" | "low";
}

const mockOperators: OperatorRow[] = [
	{
		id: "1",
		enabled: true,
		rarity: 6,
		name: "陳",
		e1: 2,
		e2: 2,
		note: "主力",
		l1: 80,
		l2: 90,
		estimatedLmd: 150000,
		estimatedExp: 120000,
		cumulativeLmd: 150000,
		cumulativeExp: 120000,
		priority: "high",
	},
	{
		id: "2",
		enabled: true,
		rarity: 6,
		name: "銀灰",
		e1: 2,
		e2: 2,
		note: "練度優先",
		l1: 70,
		l2: 90,
		estimatedLmd: 280000,
		estimatedExp: 250000,
		cumulativeLmd: 430000,
		cumulativeExp: 370000,
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
				e1: 0,
				e2: 1,
				note: "",
				l1: 1,
				l2: 1,
				estimatedLmd: 0,
				estimatedExp: 0,
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
				{/* Save Slot Section */}
				<Flex direction="column" gap="3">
					<Flex gap="2">
						<Button variant="outline" size="1" className="flex-1">
							<UploadIcon width="14" height="14" />
							導入
						</Button>
						<Button variant="outline" size="1" className="flex-1">
							<DownloadIcon width="14" height="14" />
							導出
						</Button>

						<Button onClick={addRow} size="1" className="gap-1.5">
							<Plus className="h-3.5 w-3.5" />
							新增需求列
						</Button>
					</Flex>
				</Flex>
			</div>

			<div className="flex-1 min-h-0 overflow-auto">
				<Table className="min-w-[1400px]">
					<TableHeader className="sticky top-0 bg-card z-10">
						<TableRow className="border-border hover:bg-transparent">
							<TableHead className="w-10" />
							<TableHead className="w-12 text-center">應用</TableHead>
							<TableHead className="w-20 text-center">星級</TableHead>
							<TableHead className="min-w-[100px]">角色</TableHead>
							<TableHead className="min-w-[80px]">備註</TableHead>
							<TableHead className="w-28 text-center">精英化</TableHead>
							<TableHead className="w-20 text-center">優先級</TableHead>
							<TableHead className="w-32 text-center">等級提升</TableHead>
							<TableHead className="w-24 text-right font-mono">預估錢</TableHead>
							<TableHead className="w-24 text-right font-mono">預估書</TableHead>
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
											<Input
												defaultValue={op.note}
												placeholder="備註"
												className="h-8 bg-input border-border text-xs"
											/>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1 justify-center">
												<Select defaultValue={op.e1.toString()}>
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
												<Select defaultValue={op.e2.toString()}>
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
											<div className="flex items-center gap-1.5 justify-center">
												<Input
													type="number"
													defaultValue={op.l1}
													className="h-8 w-12 text-center bg-input border-border font-mono text-xs"
												/>
												<span className="text-muted-foreground">→</span>
												<Input
													type="number"
													defaultValue={op.l2}
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
										<TableCell className="text-right font-mono text-xs text-primary">
											{formatNumber(op.cumulativeLmd)}
										</TableCell>
										<TableCell className="text-right font-mono text-xs text-primary">
											{formatNumber(op.cumulativeExp)}
										</TableCell>
										<TableCell className="text-center">
											<Button
												variant="ghost"
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
