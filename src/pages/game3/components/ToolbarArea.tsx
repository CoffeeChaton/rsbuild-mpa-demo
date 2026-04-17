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
	handleImport: () => void;
	filter: TFilter;
	setFilter: Dispatch<SetStateAction<TFilter>>;
	copyResult: () => void;
	isCopied: boolean;
	isImportSuccess: boolean;
}

export const ToolbarArea: NamedExoticComponent<IToolbarAreaProp> = memo<IToolbarAreaProp>(({
	rows,
	handleImport,
	filter,
	setFilter,
	copyResult,
	isCopied,
	isImportSuccess,
}) => {
	return (
		<Box p="3" className="border-b shadow-sm z-20">
			<Flex direction="column" gap="3">
				<Flex gap="3" wrap="wrap" align="center">
					<Flex gap="1" wrap="wrap">
						<Button variant={isImportSuccess ? "solid" : "outline"} color={isImportSuccess ? "green" : "indigo"} onClick={handleImport}>
							<ClipboardIcon /> {isImportSuccess ? "已導入原有" : "導入原有"}
						</Button>

						<PlanSwitcher />

						<Button
							variant={isCopied ? "solid" : "outline"}
							color={isCopied ? "green" : "indigo"}
							onClick={copyResult}
						>
							<BackpackIcon /> {isCopied ? "已複製" : "複製結果"}
						</Button>
					</Flex>
				</Flex>

				<MaterialToolbar
					rows={rows}
					filter={filter}
					setFilter={setFilter}
				/>
			</Flex>
		</Box>
	);
});
