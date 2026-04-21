import type { IItemRow, TFilter } from "../type";
import { CopyIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Switch, Text, TextField } from "@radix-ui/themes";
import { useClipboard } from "foxact/use-clipboard";
import { type Dispatch, type FC, type SetStateAction, useCallback } from "react";
import { toast } from "sonner";

export interface IMaterialToolbarProps {
	rows: IItemRow[];

	filter: TFilter;
	setFilter: Dispatch<SetStateAction<TFilter>>;
}

export const MaterialToolbar: FC<IMaterialToolbarProps> = ({
	rows,
	filter,
	setFilter,
}) => {
	const { copy, copied } = useClipboard({ timeout: 2000 });

	const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(f => ({ ...f, search: e.target.value }));
	}, [setFilter]);

	const handleCopyExcel = useCallback(() => {
		const lines: string[] = rows.map(r => `${r.rare}\t${r.name}\t${r.stock}\t${r.need}\t${r.total}`);
		const text = ["稀有度\t名稱\t原有\t需求\t合計", ...lines].join("\n");
		void copy(text);
		toast.success("已複製為 Excel 格式", {
			description: "您可以直接貼上到 Excel 或 Google 試算表",
		});
	}, [rows, copy]);

	const handleHideEmptyChange = useCallback((v: boolean) => {
		setFilter(f => ({ ...f, hideEmpty: v }));
	}, [setFilter]);

	return (
		<Flex align="center" gap="3">
			<Box maxWidth="200px">
				<TextField.Root
					size="2"
					placeholder="搜尋項目..."
					value={filter.search}
					onChange={handleSearchChange}
				>
					<TextField.Slot>
						<MagnifyingGlassIcon />
					</TextField.Slot>
				</TextField.Root>
			</Box>

			<Button
				variant={copied ? "solid" : "outline"}
				color={copied ? "green" : "indigo"}
				onClick={handleCopyExcel}
			>
				<CopyIcon /> {copied ? "已複製 Excel" : "複製為 Excel"}
			</Button>

			<Text as="label" size="2">
				<Flex gap="2">
					<Switch size="1" checked={filter.hideEmpty} onCheckedChange={handleHideEmptyChange} />
					隱藏無關數據
				</Flex>
			</Text>
		</Flex>
	);
};
