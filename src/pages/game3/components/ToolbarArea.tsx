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
import { type Dispatch, memo, type SetStateAction } from "react";
import type { IItemRow, TEditor, TFilter } from "../type";

export interface IToolbarAreaProp {
  rows: IItemRow[];
  setImportOpen: Dispatch<SetStateAction<boolean>>;
  setEditor: Dispatch<SetStateAction<TEditor>>;
  filter: TFilter;
  setFilter: Dispatch<SetStateAction<TFilter>>;
}

export const ToolbarArea = memo<IToolbarAreaProp>(({
  rows,
  setImportOpen,
  setEditor,
  filter,
  setFilter,
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

            <PlanSwitcher
              setEditor={setEditor}
            />

            <Button
              variant="outline"
              onClick={() => {
                const result = Object.fromEntries(rows.filter(r => r.total > 0).map(r => [r.id, r.total]));
                navigator.clipboard.writeText(JSON.stringify(result, null, 2));
              }}
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
