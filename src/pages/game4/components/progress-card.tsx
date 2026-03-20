import * as React from "react";
import { CheckCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Badge, Card, Flex, Progress, Text } from "@radix-ui/themes";

interface IStatusBadgeProps {
	status: "ok" | "warning" | "error";
	label: string;
}

const StatusBadge: React.FC<IStatusBadgeProps> = ({ status, label }) => {
	const colorMap = {
		ok: "green",
		warning: "yellow",
		error: "red",
	} as const;

	const IconMap = {
		ok: CheckCircledIcon,
		warning: ExclamationTriangleIcon,
		error: ExclamationTriangleIcon,
	} as const;

	const Icon = IconMap[status];

	return (
		<Badge color={colorMap[status]} variant="surface" className="gap-1.5 px-2">
			<Icon width="12" height="12" />
			{label}
		</Badge>
	);
};

const ProductionInsight = ({ gap, daily }: { gap: number, daily: number }) => {
	if (!daily || daily === 0) return null;

	// gap 為正數代表「缺少」，負數代表「超出」
	const days = Math.abs(Math.ceil(gap / daily));

	if (gap > 0) {
		// 缺口狀態
		return (
			<Text size="1" color="amber" className="font-medium">
				約需 {days} 天達成
			</Text>
		);
	} else if (gap < 0) {
		// 超出狀態 (溢出)
		return (
			<Text size="1" color="grass" className="font-medium">
				領先約 {days} 天產量
			</Text>
		);
	}
	return null;
};
interface IProgressCardProps {
	/** 卡片標題 */
	title: string;
	/** 顯示的 Icon 組件 */
	Icon: React.ElementType;
	/** 當前數量 */
	current: number;
	/** 差額（目標 - 當前） */
	need: number;
	/** 平均每日產量，用於 ProductionInsight */
	daily: number;
	/** 進度條顏色 */
	color: "blue" | "green";
	/** 顯示數字的格式化函數 */
	formatNumber?: (value: number) => string;
	/** 當前文字顏色，差額為溢出時使用 */
	overflowColor: "blue" | "green" | "grass";
	gapColor: "blue" | "green" | "grass" | "red";
	showPercentText?: boolean; // 是否顯示百分比文字
}

export const ProgressCard: React.FC<IProgressCardProps> = ({
	title,
	Icon,
	current,
	need,
	daily,
	color = "blue",
	formatNumber = (v) => v.toLocaleString(),
	overflowColor = "grass",
	gapColor = "red",
	showPercentText = true,
}) => {
	const target = current + need;
	const percent = Math.min(100, (current / target) * 100);
	const isMet = need <= 0;

	return (
		<Card variant="surface" className="flex-1">
			<Flex direction="column" gap="2" height="100%">
				{/* Header */}
				<Flex align="center" justify="between">
					<Flex align="center" gap="2">
						<Icon className="text-gray-500" />
						<Text size="1" weight="bold" color="gray" className="uppercase tracking-wider">
							{title}
						</Text>
					</Flex>
					<Flex align="center" gap="3">
						<ProductionInsight gap={need} daily={daily} />
						<StatusBadge status={isMet ? "ok" : "warning"} label={isMet ? "已達標" : "不足"} />
					</Flex>
				</Flex>

				{/* Body */}
				<div className="space-y-1.5 mt-1">
					<Flex justify="between" align="center">
						<Progress value={percent} size="1" color={color} className="flex-1 mr-2" />
						{showPercentText && (
							<Text size="1" weight="bold" className="w-10 text-right font-mono">
								{percent.toFixed(0)}%
							</Text>
						)}
					</Flex>

					<Flex justify="between" align="end">
						{/* 庫存 */}
						<Flex direction="column">
							<Text size="1" color="gray" className="text-[10px] uppercase opacity-50">
								庫存
							</Text>
							<Text size="1" weight="bold" className="font-mono" style={{ color: color === "green" ? "#047857" : undefined }}>
								{formatNumber(current)}
							</Text>
						</Flex>

						{/* 差額 */}
						<Flex direction="column" align="center">
							{need > 0
								? (
									<Text size="1" color={gapColor} className={`font-mono text-[10px] bg-${gapColor}-50 px-1.5 py-0.5 rounded border border-${gapColor}-100`}>
										缺 {formatNumber(need)}
									</Text>
								)
								: (
									<Text size="1" color={overflowColor} className={`font-mono text-[10px] bg-${overflowColor}-50 px-1.5 py-0.5 rounded border border-${overflowColor}-100`}>
										溢出 {formatNumber(Math.abs(need))}
									</Text>
								)}
						</Flex>

						{/* 目標 */}
						<Flex direction="column" align="end">
							<Text size="1" color="gray" className="text-[10px] uppercase opacity-50">
								目標
							</Text>
							<Text size="1" color="gray" className="font-mono">
								{formatNumber(target)}
							</Text>
						</Flex>
					</Flex>
				</div>
			</Flex>
		</Card>
	);
};
