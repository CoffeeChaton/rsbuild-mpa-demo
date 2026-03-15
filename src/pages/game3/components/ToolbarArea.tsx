import {
	Box,
	Button,
	Flex,
} from "@radix-ui/themes";
import {
	BackpackIcon,
	ClipboardIcon,
} from "@radix-ui/react-icons";
import { MaterialToolbar } from "./FilterActionBar";
import { PlanSwitcher } from "./PlanSwitcher";
import { type Dispatch, memo, type NamedExoticComponent, type SetStateAction } from "react";
import type { IItemRow, TFilter } from "../type";

export interface IToolbarAreaProp {
	rows: IItemRow[];
	setImportOpen: Dispatch<SetStateAction<boolean>>;
	filter: TFilter;
	setFilter: Dispatch<SetStateAction<TFilter>>;
	copyResult: () => void;
}

export const ToolbarArea: NamedExoticComponent<IToolbarAreaProp> = memo<IToolbarAreaProp>(({
	rows,
	setImportOpen,
	filter,
	setFilter,
	copyResult,
}) => {
	return (
		<Box p="3" className="bg-white border-b shadow-sm z-20">
			<Flex direction="column" gap="3">
				{/* 第一列：左上角核心操作 */}
				<Flex gap="3">
					<Flex gap="1">
						<Button variant="outline" onClick={() => setImportOpen(true)}>
							<ClipboardIcon /> 導入原有
						</Button>

						<PlanSwitcher />

						<Button
							variant="outline"
							onClick={copyResult}
						>
							<BackpackIcon /> 複製結果
						</Button>
					</Flex>
				</Flex>

				{/* 第二列：左側對齊搜尋與工具 */}
				<MaterialToolbar
					rows={rows}
					filter={filter}
					setFilter={setFilter}
				/>
			</Flex>
		</Box>
	);
});
