import { memo } from "react";
import { Flex, HoverCard, Text } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { MODULE_COST_DISPLAY_ROWS } from "../core/moduleCost";
import { Table, TableBody, TableCell, TableHead, TableHeader as ShadcnTableHeader, TableRow } from "@/src/components/ui/table";

/**
 * TableHeader
 *
 * 寬度設計策略： TODO sm/lm/lg size
 */
export const TableHeader: React.FC = memo(() => {
	return (
		<ShadcnTableHeader sticky>
			<TableRow className="hover:bg-transparent">
				<TableHead width="50px" className="text-center">排序</TableHead>
				<TableHead width="40px" className="text-center"></TableHead>
				<TableHead width="80px" className="text-center">星級</TableHead>
				<TableHead width="120px">角色</TableHead>
				<TableHead width="180px">備註</TableHead>
				<TableHead width="160px">
					<Flex align="center" gap="1">
						模組
						<HoverCard.Root>
							<HoverCard.Trigger>
								<button
									type="button"
									className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:text-slate-900 cursor-help"
									aria-label="檢視模組所需 LMD"
								>
									<InfoCircledIcon width="14" height="14" />
								</button>
							</HoverCard.Trigger>
							<HoverCard.Content maxWidth="360px" className="shadow-xl select-text">
								<Flex direction="column" gap="2">
									<Text size="1" weight="bold">模組 LMD 需求表 (單位：LMD)</Text>
									<Table fixed>
										<ShadcnTableHeader>
											<TableRow>
												<TableHead width="40px"></TableHead>
												<TableHead width="100px">Lv.1</TableHead>
												<TableHead width="100px">Lv.2</TableHead>
												<TableHead width="100px">Lv.3</TableHead>
											</TableRow>
										</ShadcnTableHeader>
										<TableBody>
											{MODULE_COST_DISPLAY_ROWS.map(row => (
												<TableRow key={row.rarity}>
													<TableCell className="tabular-nums font-medium">★ {row.rarity}</TableCell>
													{row.costs
														? row.costs.map((cost) => (
															<TableCell key={`${row.rarity}-${cost}`} className="whitespace-nowrap tabular-nums">
																{cost.toLocaleString()}
															</TableCell>
														))
														: (
															<TableCell colSpan={3} className="text-center text-slate-500">
																不得選
															</TableCell>
														)}
												</TableRow>
											))}
										</TableBody>
									</Table>
								</Flex>
							</HoverCard.Content>
						</HoverCard.Root>
					</Flex>
				</TableHead>
				<TableHead width="300px" className="text-left">等級提升</TableHead>
				<TableHead width="110px" className="text-right">預估錢</TableHead>
				<TableHead width="110px" className="text-right">預估書</TableHead>
				<TableHead width="130px" className="text-right">累計錢</TableHead>
				<TableHead width="130px" className="text-right">累計書</TableHead>
				<TableHead width="60px" className="text-center">操作</TableHead>
			</TableRow>
		</ShadcnTableHeader>
	);
});
