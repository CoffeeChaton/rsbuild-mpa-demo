import { type FC, Fragment, memo } from "react";
import { RARE_LEVELS } from "../shared/constants/material";
import {
	Box,
	Card,
	Table,
	Text,
} from "@radix-ui/themes";
import type { IItemRow } from "../type";

export interface ITableAreaParam {
	groupedRows: Record<number, IItemRow[]>;
}

export const TableArea: FC<ITableAreaParam> = memo<ITableAreaParam>(({ groupedRows }) => {
	return (
		<Box flexGrow="1" p="3" className="overflow-hidden">
			<Card className="h-full p-0 overflow-hidden bg-white border-slate-200">
				<Box className="h-full overflow-auto">
					<Table.Root variant="surface">
						<Table.Header className="sticky top-0 bg-white z-10 shadow-sm">
							<Table.Row>
								<Table.ColumnHeaderCell width="100px">ID</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>項目名稱</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell align="right">原有</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell align="right">方案</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell align="right" className="text-indigo-600">最終合計</Table.ColumnHeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{RARE_LEVELS.map((rare) => (
								<Fragment key={rare}>
									{(groupedRows[rare] ?? []).length > 0 && (
										<Table.Row className="bg-slate-50/50">
											<Table.RowHeaderCell colSpan={5} className="py-1 px-4">
												<Text size="1" weight="bold" color="gray">RARE {rare}</Text>
											</Table.RowHeaderCell>
										</Table.Row>
									)}
									{groupedRows[rare].map(r => (
										<Table.Row key={r.id} align="center" className="hover:bg-indigo-50/30 transition-colors">
											<Table.Cell>
												<Text size="1" className="font-mono text-slate-400">{r.id}</Text>
											</Table.Cell>
											<Table.Cell>
												<Text size="2" weight="medium">{r.name}</Text>
											</Table.Cell>
											<Table.Cell align="right">
												<Text size="2" color="gray">{r.stock}</Text>
											</Table.Cell>
											<Table.Cell align="right">
												<Text size="2" color="indigo" weight="bold">+{r.need}</Text>
											</Table.Cell>
											<Table.Cell align="right" className="bg-indigo-50/10">
												<Text size="2" weight="bold" color="indigo">{r.total}</Text>
											</Table.Cell>
										</Table.Row>
									))}
								</Fragment>
							))}
						</Table.Body>
					</Table.Root>
				</Box>
			</Card>
		</Box>
	);
});
