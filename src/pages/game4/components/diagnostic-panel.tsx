import * as React from "react";
import {
	CheckCircledIcon,
	ClockIcon,
	ExclamationTriangleIcon,
	ReaderIcon,
	StackIcon,
} from "@radix-ui/react-icons";
import { Badge, Card, Flex, Grid, Text } from "@radix-ui/themes";
import { useDiagnostics } from "../../game2/hooks/useDiagnostics";
import { useArsenalInventory, useArsenalRows } from "../../game2/context/ArsenalContext";
import { ProgressCard } from "./progress-card";

export const DiagnosticPanel: React.FC = () => {
	const { rows } = useArsenalRows();
	const { inventory } = useArsenalInventory();
	const { logs, summary } = useDiagnostics(rows, inventory);

	// 優化計數邏輯，避免重複 map/filter
	const counts = React.useMemo(() => {
		return logs.reduce((acc, log) => {
			if (log.type === "error") acc.error++;
			else if (log.type === "info" && log.id !== "ok") acc.info++;
			return acc;
		}, { error: 0, info: 0 });
	}, [logs]);

	const {
		moneyGap,
		booksGap,
	} = summary;

	const {
		money,
		books,
		avgMoneyProduction,
		avgBookProduction,
	} = inventory;

	// 隨意寫的 Mock Data
	// const data = {
	// 	lmdCurrent: money,
	// 	lmdNeeded: moneyGap,
	// 	lmdDaily: avgMoneyProduction, // 每日產能
	// 	get lmdProgress() { return (this.lmdCurrent / this.lmdNeeded) * 100 },
	// 	get lmdStatus() { return this.lmdCurrent >= this.lmdNeeded ? "ok" : "warning" },

	// 	expCurrent: books,
	// 	expNeeded: booksGap,
	// 	expDaily: avgBookProduction,
	// 	get expProgress() { return (this.expCurrent / this.expNeeded) * 100 },
	// 	get expStatus() { return this.expCurrent >= this.expNeeded ? "ok" : "warning" },
	// };

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
						{counts.error === 0
							? (
								<Badge color="green" variant="soft">
									<CheckCircledIcon width="12" height="12" className="mr-1" />
									通過
								</Badge>
							)
							: (
								<Badge color="red" variant="soft">
									<ExclamationTriangleIcon width="12" height="12" className="mr-1" />
									{counts.error} 錯誤
								</Badge>
							)}
					</Flex>
					<Text size="1" color="gray" mt="auto">
						{counts.error === 0 ? "一切正常" : "請檢查標記的列"}
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
							{summary.estimatedDays ?? "0"}
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

			{/* LMD Progress Card */}
			<ProgressCard
				title="龍門幣"
				Icon={StackIcon}
				current={money}
				gap={moneyGap}
				daily={avgMoneyProduction}
				color="blue"
				overflowColor="blue"
			/>

			{/* EXP Progress Card */}
			<ProgressCard
				title="經驗書"
				Icon={ReaderIcon}
				current={books}
				gap={booksGap}
				daily={avgBookProduction}
				color="green"
				overflowColor="grass"
			/>
		</Grid>
	);
};
