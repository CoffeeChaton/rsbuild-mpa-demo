"use client";

import * as React from "react";
import {
	CheckCircledIcon,
	ClockIcon,
	ExclamationTriangleIcon,
	ReaderIcon,
	StackIcon,
} from "@radix-ui/react-icons";
import { Badge, Card, Flex, Grid, Progress, Text } from "@radix-ui/themes";

interface IDiagnosticData {
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

const mockData: IDiagnosticData = {
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

export const DiagnosticPanel: React.FC = () => {
	const data = mockData;

	return (
		<Grid columns={{ initial: "1", sm: "2", lg: "4" }} gap="4" width="100%">
			{/* Validation Status */}
			<Card variant="surface">
				<Flex direction="column" gap="2" height="100%">
					<Flex align="center" gap="2">
						<CheckCircledIcon className="text-gray-500" />
						<Text size="1" weight="bold" color="gray" className="uppercase tracking-wider">
							數據校驗
						</Text>
					</Flex>
					<Flex align="center" gap="3" mt="1">
						{data.errors === 0
							? (
								<Badge color="green" variant="soft">
									<CheckCircledIcon width="12" height="12" className="mr-1" />
									通過
								</Badge>
							)
							: (
								<Badge color="red" variant="soft">
									<ExclamationTriangleIcon width="12" height="12" className="mr-1" />
									{data.errors} 錯誤
								</Badge>
							)}
					</Flex>
					<Text size="1" color="gray" mt="auto">
						{data.errors === 0 ? "一切正常" : "請檢查標記的列"}
					</Text>
				</Flex>
			</Card>

			{/* Estimated Days */}
			<Card variant="surface">
				<Flex direction="column" gap="2" height="100%">
					<Flex align="center" gap="2">
						<ClockIcon className="text-gray-500" />
						<Text size="1" weight="bold" color="gray" className="uppercase tracking-wider">
							預估剩餘
						</Text>
					</Flex>
					<Flex align="baseline" gap="1" mt="1">
						<Text size="8" weight="bold" className="font-mono text-blue-600 dark:text-blue-400">
							{data.estimatedDays ?? "—"}
						</Text>
						<Text size="2" color="gray">
							天
						</Text>
					</Flex>
					<Text size="1" color="gray" mt="auto">
						依據每日產能計算
					</Text>
				</Flex>
			</Card>

			{/* LMD Progress */}
			<Card variant="surface">
				<Flex direction="column" gap="2" height="100%">
					<Flex align="center" justify="between">
						<Flex align="center" gap="2">
							<StackIcon className="text-gray-500" />
							<Text size="1" weight="bold" color="gray" className="uppercase tracking-wider">
								龍門幣
							</Text>
						</Flex>
						<StatusBadge
							status={data.lmdStatus}
							label={data.lmdStatus === "ok" ? "已達標" : "不足"}
						/>
					</Flex>
					<div className="space-y-1.5 mt-1">
						<Progress value={data.lmdProgress} size="1" color="blue" />
						<Flex justify="between">
							<Text size="1" color="gray" className="font-mono">
								{formatNumber(data.lmdCurrent)}
							</Text>
							<Text size="1" color="gray" className="font-mono">
								{formatNumber(data.lmdNeeded)}
							</Text>
						</Flex>
					</div>
				</Flex>
			</Card>

			{/* EXP Progress */}
			<Card variant="surface">
				<Flex direction="column" gap="2" height="100%">
					<Flex align="center" justify="between">
						<Flex align="center" gap="2">
							<ReaderIcon className="text-gray-500" />
							<Text size="1" weight="bold" color="gray" className="uppercase tracking-wider">
								經驗書
							</Text>
						</Flex>
						<StatusBadge
							status={data.expStatus}
							label={data.expStatus === "ok" ? "已達標" : "不足"}
						/>
					</Flex>
					<div className="space-y-1.5 mt-1">
						<Progress value={data.expProgress} size="1" color="green" />
						<Flex justify="between">
							<Text size="1" color="gray" className="font-mono">
								{formatNumber(data.expCurrent)}
							</Text>
							<Text size="1" color="gray" className="font-mono">
								{formatNumber(data.expNeeded)}
							</Text>
						</Flex>
					</div>
				</Flex>
			</Card>
		</Grid>
	);
};
