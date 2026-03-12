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
import type { Dispatch, SetStateAction } from "react";
import type { IItemRow } from "../type";

export interface IToolbarAreaProp {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  rows: IItemRow[];
  hideEmpty: boolean;
  setHideEmpty: Dispatch<SetStateAction<boolean>>;
  planName: string;
  setPlanName: Dispatch<SetStateAction<string>>;
  customPlans: Record<string, string>;
  setCustomPlans: Dispatch<SetStateAction<Record<string, string>>>;
  setEditTargetId: Dispatch<SetStateAction<string | null>>;
  setEditTitle: Dispatch<SetStateAction<string>>;
  setEditContent: Dispatch<SetStateAction<string>>;
  setEditorOpen: Dispatch<SetStateAction<boolean>>;
  tsvB: string;
  //
  setImportOpen: Dispatch<SetStateAction<boolean>>;
}

export const ToolbarArea: React.FC<IToolbarAreaProp> = ({
  search,
  setSearch,
  rows,
  hideEmpty,
  setHideEmpty,
  planName,
  setPlanName,
  customPlans,
  setCustomPlans,
  setEditTargetId,
  setEditTitle,
  setEditContent,
  setEditorOpen,
  tsvB,
  setImportOpen,
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
              planName={planName}
              setPlanName={setPlanName}
              customPlans={customPlans}
              setCustomPlans={setCustomPlans}
              setEditTargetId={setEditTargetId}
              setEditTitle={setEditTitle}
              setEditContent={setEditContent}
              setEditorOpen={setEditorOpen}
              tsvB={tsvB}
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
          search={search}
          setSearch={setSearch}
          rows={rows}
          hideEmpty={hideEmpty}
          setHideEmpty={setHideEmpty}
        />
      </Flex>
    </Box>
  );
};
