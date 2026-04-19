/**
 * 基本資料面板 (BasicInfoPanel)
 *
 * 預期行為：
 * 1. 管理玩家當前的庫存資源 (龍門幣、各級經驗書)。
 * 2. 管理玩家的每日產能預估 (用於計算剩餘天數)。
 * 3. 即時更新全域 Context，驅動後續的表格計算與診斷面板。
 *
 * 數據流向 (Source of Truth)：
 * - 作為數據的「源頭」，修改此處的 `inventory` 會觸發 `ArsenalContext` 重新計算所有 `rows`。
 */

import * as React from "react";
import { memo, useCallback, useMemo } from "react";
import { ReaderIcon, StackIcon } from "@radix-ui/react-icons";
import {
	Card,
	Flex,
	Separator,
	Text,
	TextField,
	Tooltip,
} from "@radix-ui/themes";
import { BOOK_CONFIG, type TBookKey } from "../config/inventory";
import { useArsenalInventory } from "../context/ArsenalContext";
import type { IInventory } from "../types/inventory";
import { useInventory } from "../hooks/useInventory";
import { calculateBookStacksValue } from "../core/calculateBookStacksValue";

// 輔助函數：確保輸入值為正數
const clampPositiveNumber = (value: string): number => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
};

type ProductionFieldKey = "avgMoneyProduction" | "avgBookProduction";
type TInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;

const PRODUCTION_FIELDS: { key: ProductionFieldKey, label: string, unit: string }[] = [
	{ key: "avgMoneyProduction", label: "平均龍門幣產出", unit: "LMD" },
	{ key: "avgBookProduction", label: "平均經驗書產出", unit: "EXP" },
];

function createBookStackChangeHandlers(
	handleStackChange: (key: TBookKey, value: string) => void,
): Record<TBookKey, TInputChangeHandler> {
	return {
		advanced: (event) => {
			handleStackChange("advanced", event.target.value);
		},
		intermediate: (event) => {
			handleStackChange("intermediate", event.target.value);
		},
		primary: (event) => {
			handleStackChange("primary", event.target.value);
		},
		basic: (event) => {
			handleStackChange("basic", event.target.value);
		},
	};
}

function createProductionChangeHandlers(
	handleProductionChange: (key: ProductionFieldKey, value: string) => void,
): Record<ProductionFieldKey, TInputChangeHandler> {
	return {
		avgMoneyProduction: (event) => {
			handleProductionChange("avgMoneyProduction", event.target.value);
		},
		avgBookProduction: (event) => {
			handleProductionChange("avgBookProduction", event.target.value);
		},
	};
}

export const BasicInfoPanel: React.FC = memo(() => {
	const { inventory, setInventory } = useArsenalInventory();

	// 更新全域庫存狀態
	const onUpdate = useCallback((update: Partial<IInventory>) => {
		setInventory(prev => ({ ...prev, ...update }));
	}, [setInventory]);

	const { handleStackChange, handleProductionChange } = useInventory(inventory, onUpdate);
	const handleMoneyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		onUpdate({ money: clampPositiveNumber(e.target.value) });
	}, [onUpdate]);
	const stackChangeHandlers = useMemo(() => createBookStackChangeHandlers(handleStackChange), [handleStackChange]);
	const productionChangeHandlers = useMemo(
		() => createProductionChangeHandlers(handleProductionChange),
		[handleProductionChange],
	);

	const bookStacks = inventory.bookStacks;
	const totalExpValue = calculateBookStacksValue(bookStacks);

	return (
		<Flex direction="column" gap="4" className="min-h-0">
			{/* 1. 庫存資源區塊 */}
			<Flex direction="column" gap="3">
				<Flex align="center" gap="2" px="1">
					<StackIcon className="text-blue-500" />
					<Text size="1" weight="bold" color="gray" className="uppercase tracking-widest">
						庫存資源 (Inventory)
					</Text>
				</Flex>

				<Card variant="surface" className="bg-gray-50/30 dark:bg-gray-900/30 border-dashed">
					<Flex direction="column" gap="4" p="2">
						{/* 龍門幣輸入：直接修改 money 數值 */}
						<Flex direction="column" gap="2">
							<Text size="1" weight="bold">
								{`龍門幣 (LMD ${(inventory.money / 10000).toFixed(1)} 萬)`}
							</Text>
							<TextField.Root
								type="number"
								value={inventory.money}
								onChange={handleMoneyChange}
								size="1"
								variant="surface"
								className="font-mono"
							/>
						</Flex>

						{/* 作戰記錄細項：根據各等級數量計算總 EXP */}
						<Flex direction="column" gap="2">
							<Flex justify="between" align="center" mb="1" className="border-b border-gray-200 dark:border-gray-800 pb-1">
								<Text size="1" weight="bold">作戰記錄 (EXP)</Text>
								<Text size="1" color="blue" className="tabular-nums font-mono">
									{totalExpValue.toLocaleString()}
								</Text>
							</Flex>

							<Flex direction="column" gap="2">
								{BOOK_CONFIG.map((conf) => (
									<div key={conf.label} className="grid items-center grid-cols-[1fr_90px] gap-2">
										<Tooltip content={`每份 ${conf.value.toLocaleString()} EXP`}>
											<Text size="1" color="gray" className="truncate cursor-help opacity-80">
												• {conf.label}
											</Text>
										</Tooltip>
										<TextField.Root
											size="1"
											variant="surface"
											className="font-mono tabular-nums"
											type="number"
											value={bookStacks[conf.key]}
											onChange={stackChangeHandlers[conf.key]}
										/>
									</div>
								))}
							</Flex>
						</Flex>
					</Flex>
				</Card>
			</Flex>

			<Separator size="4" />

			{/* 2. 每日產能區塊 */}
			<Flex direction="column" gap="3">
				<Flex align="center" gap="2" px="1">
					<ReaderIcon className="text-green-500" />
					<Text size="1" weight="bold" color="gray" className="uppercase tracking-widest">
						每日產能 (Production)
					</Text>
				</Flex>
				<Card variant="surface" className="bg-gray-50/30 dark:bg-gray-900/30 border-dashed">
					<Flex direction="column" gap="3" p="2">
						{PRODUCTION_FIELDS.map(field => (
							<div key={field.label} className="grid items-center grid-cols-[1fr_90px] gap-2">
								<Text size="1" color="gray" weight="medium">
									{field.label.replace("平均", "").replace("產出", "")}
								</Text>
								<TextField.Root
									type="number"
									size="1"
									variant="surface"
									value={inventory[field.key]}
									onChange={productionChangeHandlers[field.key]}
									className="font-mono"
									placeholder={field.unit}
								/>
							</div>
						))}
					</Flex>
				</Card>
			</Flex>
		</Flex>
	);
});
