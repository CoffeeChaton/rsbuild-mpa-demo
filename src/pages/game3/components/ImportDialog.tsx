import React from "react";
import {
  Button,
  Dialog,
  Flex,
} from "@radix-ui/themes";

export interface IImportDialogParam {
  importOpen: boolean;
  setImportOpen: React.Dispatch<React.SetStateAction<boolean>>;
  jsonA: string;
  setJsonA: React.Dispatch<React.SetStateAction<string>>;
}

export const ImportDialog: React.FC<IImportDialogParam> = ({
  importOpen,
  setImportOpen,
  jsonA,
  setJsonA,
}) => {
  return (
    <Dialog.Root open={importOpen} onOpenChange={setImportOpen}>
      <Dialog.Content style={{ maxWidth: 450 }} className="rounded-3xl">
        <Dialog.Title size="3">導入原有數據 (JSON)</Dialog.Title>
        <textarea
          className="w-full h-48 p-4 rounded-xl border-none font-mono text-xs bg-slate-100 mt-4"
          value={jsonA}
          onChange={e => setJsonA(e.target.value)}
        />
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button color="indigo" className="px-6">保存</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
