/**
 * 診斷面板 (DiagnosticPanel)
 *
 * 預期行為：
 * 1. 顯示數據校驗狀態 (是否有錯誤的輸入)。
 * 2. 顯示預估完成所有規劃所需的剩餘天數。
 * 3. 顯示龍門幣與經驗書的詳細進度條 (庫存 vs 需求)。
 *
 * 數據流向 (Sink)：
 * - 作為數據的「終點」，訂閱 `useArsenalRows` 與 `useArsenalInventory`。
 * - 透過 `useDiagnostics` 勾子計算最終的缺口與天數，並呈現給玩家。
 */

import {
	CheckCircledIcon,
	ClockIcon,
	ExclamationTriangleIcon,
	ReaderIcon,
	StackIcon,
} from "@radix-ui/react-icons";
import { Badge, Card, Flex, Text } from "@radix-ui/themes";
import { useDiagnostics } from "../hooks/useDiagnostics";
import { useArsenalInventory, useArsenalRows } from "../context/ArsenalContext";
import { ProgressCard } from "./progress-card";
import { memo, useMemo } from "react";
import { calculateBookStacksValue } from "../core/calculateBookStacksValue";

export const DiagnosticPanel: React.FC = memo(() => {
	const { rows } = useArsenalRows();
	const { inventory } = useArsenalInventory();

	// 核心邏輯：將當前表格列 (rows) 與玩家庫存 (inventory) 進行比對診斷
	const { logs, summary } = useDiagnostics(rows, inventory);

	// 計算錯誤數量，用於校驗顯示
	const counts = useMemo(() => {
		return logs.reduce((acc, log) => {
			if (log.type === "error") acc.error += 1;
			else if (log.type === "info" && log.id !== "ok") acc.info += 1;
			return acc;
		}, { error: 0, info: 0 });
	}, [logs]);

	const { moneyGap, booksGap } = summary;

	const {
		money,
		bookStacks,
		avgMoneyProduction,
		avgBookProduction,
	} = inventory;

	const books = calculateBookStacksValue(bookStacks);

	return (
		<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{/* 1. 數據校驗：確認表格輸入是否有誤 */}
			<Card variant="surface">
				<Flex direction="column" gap="2" height="100%">
					<Flex align="center" gap="2">
						<CheckCircledIcon className="text-gray-500" />
						<Text size="1" weight="bold" color="gray" className="uppercase tracking-wider">
							數據校驗 (Validation)
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
						{counts.error === 0 ? "所有數據格式正確" : "請檢查表格中標記紅色的部分"}
					</Text>
				</Flex>
			</Card>

			{/* 2. 預估剩餘：根據缺口與日產能計算天數 */}
			<Card variant="surface">
				<Flex direction="column" gap="2" height="100%">
					<Flex align="center" gap="2">
						<ClockIcon className="text-gray-500" />
						<Text size="1" weight="bold" color="gray" className="uppercase tracking-wider">
							預估剩餘 (ETA)
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
						依據玩家設定的每日產能計算
					</Text>
				</Flex>
			</Card>

			{/* 3. 龍門幣進度：顯示當前缺口與庫存佔比 */}
			<ProgressCard
				title="龍門幣進度"
				Icon={StackIcon}
				current={money}
				need={moneyGap}
				daily={avgMoneyProduction}
				color="blue"
				overflowColor="blue"
				gapColor="red"
			/>

			{/* 4. 經驗書進度：顯示當前缺口與庫存佔比 */}
			<ProgressCard
				title="經驗書進度"
				Icon={ReaderIcon}
				current={books}
				need={booksGap}
				daily={avgBookProduction}
				color="green"
				overflowColor="green"
				gapColor="red"
			/>
		</div>
	);
});
