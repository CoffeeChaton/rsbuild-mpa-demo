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
	gap: number;
	/** 平均每日產量，用於 ProductionInsight */
	daily: number;
	/** 進度條顏色 */
	color: "blue" | "green";
	/** 顯示數字的格式化函數 */
	formatNumber?: (value: number) => string;
	/** 當前文字顏色，差額為溢出時使用 */
	overflowColor: "blue" | "green" | "grass";
}

export const ProgressCard: React.FC<IProgressCardProps> = ({
	title,
	Icon,
	current,
	gap,
	daily,
	color = "blue",
	formatNumber = (v) => v.toLocaleString(),
	overflowColor = "grass",
}) => {
	const isMet = Number(gap) <= 0;

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
						<ProductionInsight gap={gap} daily={daily} />
						<StatusBadge
							status={isMet ? "ok" : "warning"}
							label={isMet ? "已達標" : "不足"}
						/>
					</Flex>
				</Flex>

				{/* Body */}
				<div className="space-y-1.5 mt-1">
					<Progress
						value={Math.min(100, (Number(current) / (Number(current) + Number(gap))) * 100)}
						size="1"
						color={color}
					/>

					<Flex justify="between" align="end">
						{/* 當前 */}
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
							{Number(gap) > 0
								? (
									<Text
										size="1"
										color="red"
										className="font-mono text-[10px] bg-red-50 px-1.5 py-0.5 rounded border border-red-100"
									>
										缺 {formatNumber(gap)}
									</Text>
								)
								: (
									<Text
										size="1"
										color={overflowColor}
										className={`font-mono text-[10px] bg-${overflowColor}-50 px-1.5 py-0.5 rounded border border-${overflowColor}-100`}
									>
										溢 {formatNumber(Math.abs(Number(gap)))}
									</Text>
								)}
						</Flex>

						{/* 目標 */}
						<Flex direction="column" align="end">
							<Text size="1" color="gray" className="text-[10px] uppercase opacity-50">
								目標
							</Text>
							<Text size="1" color="gray" className="font-mono">
								{formatNumber(Number(current) + Number(gap))}
							</Text>
						</Flex>
					</Flex>
				</div>
			</Flex>
		</Card>
	);
};
