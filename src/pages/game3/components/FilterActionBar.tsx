import { Button, Flex, Switch, Text, TextField } from "@radix-ui/themes";
import { CopyIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import type { Dispatch, SetStateAction } from "react";
import type { IItemRow, TFilter } from "../type";

export interface IMaterialToolbarProps {
  rows: IItemRow[];

  filter: TFilter;
  setFilter: Dispatch<SetStateAction<TFilter>>;
}

export const MaterialToolbar: React.FC<IMaterialToolbarProps> = ({
  rows,
  filter,
  setFilter,
}) => {
  return (
    <Flex align="center" gap="3">
      <TextField.Root size="2" placeholder="搜尋項目..." className="w-56 bg-slate-50" value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}>
        <TextField.Slot>
          <MagnifyingGlassIcon />
        </TextField.Slot>
      </TextField.Root>

      <Button
        variant="outline"
        onClick={() => {
          const lines: string[] = rows.map(r => `${r.rare}\t${r.name}\t${r.stock}\t${r.need}\t${r.total}`);
          navigator.clipboard.writeText(
            ["稀有度\t名稱\t原有\t需求\t合計", ...lines].join("\n"),
          );
        }}
      >
        <CopyIcon /> 複製為 Excel
      </Button>

      <Text as="label" size="2">
        <Flex gap="2">
          <Switch size="1" checked={filter.hideEmpty} onCheckedChange={(v) => setFilter(f => ({ ...f, hideEmpty: v }))} />
          隱藏無關數據
        </Flex>
      </Text>
    </Flex>
  );
};
