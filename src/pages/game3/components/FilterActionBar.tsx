import { Button, Flex, Switch, Text, TextField } from "@radix-ui/themes";
import { CopyIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import type { Dispatch, SetStateAction } from "react";
import type { IItemRow } from "../type";

export interface IMaterialToolbarProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  rows: IItemRow[];
  hideEmpty: boolean;
  setHideEmpty: Dispatch<SetStateAction<boolean>>;
}

export const MaterialToolbar: React.FC<IMaterialToolbarProps> = ({
  search,
  setSearch,
  rows,
  hideEmpty,
  setHideEmpty,
}) => {
  return (
    <Flex align="center" gap="3">
      <TextField.Root size="2" placeholder="搜尋項目..." className="w-56 bg-slate-50" value={search} onChange={e => setSearch(e.target.value)}>
        <TextField.Slot>
          <MagnifyingGlassIcon />
        </TextField.Slot>
      </TextField.Root>

      <Button
        variant="outline"
        onClick={() => {
          let out = "稀有度\t名稱\t原有\t需求\t合計\n";
          rows.forEach(r => {
            out += `${r.rare}\t${r.name}\t${r.stock}\t${r.need}\t${r.total}\n`;
          });
          navigator.clipboard.writeText(out);
        }}
      >
        <CopyIcon /> 複製為 Excel
      </Button>

      <Text as="label" size="2">
        <Flex gap="2">
          <Switch size="1" checked={hideEmpty} onCheckedChange={setHideEmpty} />
          隱藏無關數據
        </Flex>
      </Text>
    </Flex>
  );
};
