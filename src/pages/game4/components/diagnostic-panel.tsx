"use client";

import {
	AlertCircle,
	BookOpen,
	CheckCircle,
	Clock,
	Coins,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { Progress } from "@/src/components/ui/progress";
import type { JSX } from "react/jsx-runtime";

interface DiagnosticData {
	errors: number;
	lmdStatus: "ok" | "warning" | "error";
	expStatus: "ok" | "warning" | "error";
	estimatedDays: number | null;
	lmdProgress: number;
	expProgress: number;
	lmdNeeded: number;
	expNeeded: number;
	lmdCurrent: number;
	expCurrent: number;
}

const mockData: DiagnosticData = {
	errors: 0,
	lmdStatus: "ok",
	expStatus: "warning",
	estimatedDays: 12,
	lmdProgress: 85,
	expProgress: 65,
	lmdNeeded: 642000,
	expNeeded: 560000,
	lmdCurrent: 500000,
	expCurrent: 350000,
};

function formatNumber(num: number): string {
	return num.toLocaleString("zh-TW");
}

function StatusBadge({
	status,
	label,
}: {
	status: "ok" | "warning" | "error",
	label: string,
}) {
	const statusStyles = {
		ok: "bg-success/20 text-success border-success/30",
		warning: "bg-warning/20 text-warning border-warning/30",
		error: "bg-destructive/20 text-destructive border-destructive/30",
	};

	return (
		<Badge
			variant="outline"
			className={cn("font-medium gap-1.5", statusStyles[status])}
		>
			{status === "ok" && <CheckCircle className="h-3 w-3" />}
			{status === "warning" && <AlertCircle className="h-3 w-3" />}
			{status === "error" && <AlertCircle className="h-3 w-3" />}
			{label}
		</Badge>
	);
}

export const DiagnosticPanel = (): JSX.Element => {
	const data = mockData;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
			{/* Validation Status */}
			<div className="flex flex-col gap-2 p-3 rounded-lg bg-card/50 border border-border">
				<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
					<CheckCircle className="h-3.5 w-3.5" />
					<span>數據校驗</span>
				</div>
				<div className="flex items-center gap-3 mt-1">
					{data.errors === 0
						? (
							<Badge className="bg-success/20 text-success border-success/30 font-mono">
								<CheckCircle className="h-3 w-3 mr-1" />
								通過
							</Badge>
						)
						: (
							<Badge className="bg-destructive/20 text-destructive border-destructive/30 font-mono">
								<AlertCircle className="h-3 w-3 mr-1" />
								{data.errors} 錯誤
							</Badge>
						)}
				</div>
				<p className="text-xs text-muted-foreground mt-auto">
					{data.errors === 0 ? "一切正常" : "請檢查標記的列"}
				</p>
			</div>

			{/* Estimated Days */}
			<div className="flex flex-col gap-2 p-3 rounded-lg bg-card/50 border border-border">
				<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
					<Clock className="h-3.5 w-3.5" />
					<span>預估剩餘</span>
				</div>
				<div className="flex items-baseline gap-1 mt-1">
					<span className="text-2xl font-bold font-mono text-primary">
						{data.estimatedDays ?? "—"}
					</span>
					<span className="text-sm text-muted-foreground">天</span>
				</div>
				<p className="text-xs text-muted-foreground mt-auto">
					依據每日產能計算
				</p>
			</div>

			{/* LMD Progress */}
			<div className="flex flex-col gap-2 p-3 rounded-lg bg-card/50 border border-border">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
						<Coins className="h-3.5 w-3.5" />
						<span>龍門幣</span>
					</div>
					<StatusBadge
						status={data.lmdStatus}
						label={data.lmdStatus === "ok" ? "已達標" : "不足"}
					/>
				</div>
				<div className="space-y-1.5 mt-1">
					<Progress value={data.lmdProgress} className="h-2" />
					<div className="flex justify-between text-xs font-mono">
						<span className="text-muted-foreground">
							{formatNumber(data.lmdCurrent)}
						</span>
						<span className="text-foreground">
							{formatNumber(data.lmdNeeded)}
						</span>
					</div>
				</div>
			</div>

			{/* EXP Progress */}
			<div className="flex flex-col gap-2 p-3 rounded-lg bg-card/50 border border-border">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
						<BookOpen className="h-3.5 w-3.5" />
						<span>經驗書</span>
					</div>
					<StatusBadge
						status={data.expStatus}
						label={data.expStatus === "ok" ? "已達標" : "不足"}
					/>
				</div>
				<div className="space-y-1.5 mt-1">
					<Progress value={data.expProgress} className="h-2" />
					<div className="flex justify-between text-xs font-mono">
						<span className="text-muted-foreground">
							{formatNumber(data.expCurrent)}
						</span>
						<span className="text-foreground">
							{formatNumber(data.expNeeded)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
