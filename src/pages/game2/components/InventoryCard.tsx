// src/pages/game2/components/InventoryCard.tsx

import React from "react";
import { Button, Card, Flex, ScrollArea, Separator, Text, TextField, Tooltip } from "@radix-ui/themes";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../../../components/ui/accordion";
import { DownloadIcon, UploadIcon } from "@radix-ui/react-icons";
import { useInventory } from "../hooks/useInventory";
import { BOOK_CONFIG, calculateBookStacksValue, DEFAULT_BOOK_STACKS } from "../config/inventory";
import type { IInventory } from "../types";

interface IInventoryCardProps {
	inventory: IInventory;
	onUpdate: (update: Partial<IInventory>) => void;
}

const clampPositiveNumber = (value: string) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
};

type ProductionFieldKey = "avgMoneyProduction" | "avgBookProduction";

const PRODUCTION_FIELDS: { key: ProductionFieldKey, label: string, unit: string }[] = [
	{ key: "avgMoneyProduction", label: "平均龍門幣產出", unit: "LMD" },
	{ key: "avgBookProduction", label: "平均經驗書產出", unit: "EXP" },
];

export const InventoryCard: React.FC<IInventoryCardProps> = ({ inventory, onUpdate }) => {
	const {
		handleStackChange,
		handleProductionChange,
		handleClipboardExport,
		handleClipboardImport,
	} = useInventory(inventory, onUpdate);

	const bookStacks = inventory.bookStacks ?? DEFAULT_BOOK_STACKS;
	const totalExpValue = calculateBookStacksValue(bookStacks);

	return (
		<Card size="2" className="flex h-full flex-col overflow-y-auto">
			<Flex direction="column" gap="4" className="flex-1 min-h-0">
				<Flex align="center" justify="between" className="flex-wrap gap-3">
					<Flex direction="column" gap="1">
						<Text size="3" weight="bold">更新你的龍門幣 / 作戰記錄</Text>
						<Text size="1" color="gray">調整數值會同步保存，其他區塊可直接使用。</Text>
					</Flex>
					<Flex align="center" gap="2" className="flex-wrap">
						<Button variant="soft" size="2" onClick={handleClipboardImport}>
							<UploadIcon /> 從 Excel 導入
						</Button>
						<Button variant="outline" size="2" onClick={handleClipboardExport}>
							<DownloadIcon /> 匯出 TSV
						</Button>
					</Flex>
				</Flex>

				<Flex align="center" gap="1" className="whitespace-nowrap">
					<Text size="1" color="gray" weight="bold">庫存</Text>
					<Separator size="4" />
				</Flex>

				<div className="grid gap-2 sm:[grid-template-columns:140px_minmax(0,1fr)]">
					<Text size="1" weight="bold" className="shrink-0">龍門幣</Text>
					<TextField.Root
						size="1"
						variant="soft"
						placeholder="輸入目前持有量"
						type="number"
						min="0"
						step="100"
						inputMode="numeric"
						value={inventory.money}
						onChange={(e) => onUpdate({ money: clampPositiveNumber(e.target.value) })}
						className="tabular-nums w-full"
					/>
				</div>

				<Accordion type="multiple">
					<AccordionItem value="exp">
						<AccordionTrigger
							className="rounded-xl border px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
							style={{
								backgroundImage: "radial-gradient(circle at top, rgba(14,165,233,0.35), rgba(14,165,233,0.05))",
								borderColor: "rgba(14,165,233,0.25)",
							}}
						>
							<Flex gap="2" align="center" className="flex-wrap">
								<Text size="2" weight="bold">作戰記錄</Text>
								<Text size="1" color="gray" className="tabular-nums">合計 {totalExpValue.toLocaleString()} EXP</Text>
							</Flex>
						</AccordionTrigger>
						<AccordionContent>
							<ScrollArea scrollbars="vertical" style={{ maxHeight: 220 }}>
								<Flex direction="column" gap="2" pr="3" pt="1">
									{BOOK_CONFIG.map((conf, i) => (
										<div
											key={conf.label}
											className="grid items-center gap-3 sm:[grid-template-columns:140px_minmax(0,1fr)]"
										>
											<Tooltip content={`${conf.label}：每份 ${conf.value.toLocaleString()} EXP`}>
												<Text size="1" color="gray" weight="bold" className="truncate">
													• {conf.label}
												</Text>
											</Tooltip>
											<TextField.Root
												size="1"
												variant="soft"
												type="number"
												min="0"
												step="1"
												inputMode="numeric"
												value={bookStacks[i] ?? 0}
												onChange={(e) => handleStackChange(i, e.target.value)}
												className="tabular-nums w-full"
											/>
										</div>
									))}
								</Flex>
							</ScrollArea>
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<Flex align="center" gap="1" className="whitespace-nowrap">
					<Text size="1" color="gray" weight="bold">產能</Text>
					<Separator size="4" />
				</Flex>

				<Flex direction="column" gap="3">
					{PRODUCTION_FIELDS.map(field => (
						<div key={field.key} className="grid gap-2 sm:[grid-template-columns:140px_minmax(0,1fr)]">
							<Text size="1" color="gray" weight="bold" className="shrink-0">{field.label}</Text>
							<TextField.Root
								size="1"
								variant="soft"
								placeholder={`0 ${field.unit}`}
								type="number"
								min="0"
								step="1"
								inputMode="numeric"
								value={inventory[field.key] ?? 0}
								onChange={(e) => handleProductionChange(field.key, e.target.value)}
								className="tabular-nums w-full"
							/>
						</div>
					))}
				</Flex>
			</Flex>
		</Card>
	);
};
