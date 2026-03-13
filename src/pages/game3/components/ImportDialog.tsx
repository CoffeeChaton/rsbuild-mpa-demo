// src/pages/game3/components/ImportDialog.tsx
import { type Dispatch, type FC, type SetStateAction, useState } from "react";
import {
  Button,
  Dialog,
  Flex,
} from "@radix-ui/themes";

export interface IImportDialogParam {
  importOpen: boolean;
  setImportOpen: Dispatch<SetStateAction<boolean>>;
  jsonA: string;
  setJsonA: Dispatch<SetStateAction<string>>;
}

export const ImportDialog: FC<IImportDialogParam> = ({
  importOpen,
  setImportOpen,
  jsonA,
  setJsonA,
}) => {
  // 1. 內部狀態只在組件 mount 時從 Props 取一次初始值
  // 2. 當 Dialog 透過 onOpenChange 關閉再開啟時，我們不需要 useEffect 同步
  //    而是讓父組件控制這個組件的 Key (下一個步驟會講到)
  const [tempJson, setTempJson] = useState(jsonA);

  const handleSave = () => {
    setJsonA(tempJson);
    setImportOpen(false);
  };

  return (
    <Dialog.Root open={importOpen} onOpenChange={setImportOpen}>
      <Dialog.Content style={{ maxWidth: 450 }} className="rounded-3xl">
        <Dialog.Title size="3">導入原有數據 (JSON)</Dialog.Title>
        <textarea
          className="w-full h-48 p-4 rounded-xl border-none font-mono text-xs bg-slate-100 mt-4"
          value={tempJson}
          onChange={(e) => setTempJson(e.target.value)}
        />
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">取消</Button>
          </Dialog.Close>
          <Button color="indigo" className="px-6" onClick={handleSave}>
            保存
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
