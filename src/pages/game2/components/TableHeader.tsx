import { memo } from "react";
import { Flex, HoverCard, Table, Text } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { MODULE_COST_DISPLAY_ROWS } from "../core/moduleCost";

/**
 * TableHeader
 *
 * 靜態 Header
 * 使用 memo 保證不會重新 render
 */
export const TableHeader: React.FC = memo(() => {
	return (
		<Table.Header>
			<Table.Row align="center">
				<Table.ColumnHeaderCell width="60px" align="center">排序</Table.ColumnHeaderCell>
				<Table.ColumnHeaderCell width="28px"></Table.ColumnHeaderCell>
				<Table.ColumnHeaderCell width="28px">星級</Table.ColumnHeaderCell>
				<Table.ColumnHeaderCell minWidth="100px">角色</Table.ColumnHeaderCell>
				<Table.ColumnHeaderCell minWidth="140px">備註</Table.ColumnHeaderCell>
				<Table.ColumnHeaderCell>
					<Flex align="center" gap="1">
						模組
						<HoverCard.Root>
							<HoverCard.Trigger>
								<button
									type="button"
									className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:text-slate-900"
									aria-label="檢視模組所需 LMD"
								>
									<InfoCircledIcon width="14" height="14" />
								</button>
							</HoverCard.Trigger>
							<HoverCard.Content maxWidth="360px" className="shadow-xl select-text">
								<Flex direction="column" gap="2">
									<Text size="1" weight="bold">模組 LMD 需求表 (單位：LMD)</Text>
									<Table.Root size="1" variant="surface">
										<Table.Header>
											<Table.Row>
												<Table.ColumnHeaderCell></Table.ColumnHeaderCell>
												<Table.ColumnHeaderCell>Lv.1</Table.ColumnHeaderCell>
												<Table.ColumnHeaderCell>Lv.2</Table.ColumnHeaderCell>
												<Table.ColumnHeaderCell>Lv.3</Table.ColumnHeaderCell>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											{MODULE_COST_DISPLAY_ROWS.map(row => (
												<Table.Row key={row.rarity}>
													<Table.RowHeaderCell className="tabular-nums">★ {row.rarity}</Table.RowHeaderCell>
													{row.costs
														? row.costs.map((cost, idx) => (
															<Table.Cell key={idx} className="whitespace-nowrap tabular-nums">
																{cost.toLocaleString()}
															</Table.Cell>
														))
														: (
															<Table.Cell colSpan={3} className="text-center text-slate-500">
																不得選
															</Table.Cell>
														)}
												</Table.Row>
											))}
										</Table.Body>
									</Table.Root>
								</Flex>
							</HoverCard.Content>
						</HoverCard.Root>
					</Flex>
				</Table.ColumnHeaderCell>
				<Table.ColumnHeaderCell>等級提升</Table.ColumnHeaderCell>
				<Table.ColumnHeaderCell width="100px">預估錢</Table.ColumnHeaderCell>
				<Table.ColumnHeaderCell width="100px">預估書</Table.ColumnHeaderCell>
				<Table.ColumnHeaderCell width="130px">累計錢</Table.ColumnHeaderCell>
				<Table.ColumnHeaderCell width="130px">累計書</Table.ColumnHeaderCell>
				<Table.ColumnHeaderCell width="60px" align="center">操作</Table.ColumnHeaderCell>
			</Table.Row>
		</Table.Header>
	);
});
