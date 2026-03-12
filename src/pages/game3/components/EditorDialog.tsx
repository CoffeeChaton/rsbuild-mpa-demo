import React from "react";
import {
  Box,
  Button,
  Dialog,
  DropdownMenu,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import {
  ChevronDownIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";

export interface IEditorDialogParam {
  editorOpen: boolean;
  setEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadDefaultToEditor: (p: string) => Promise<void>;
  editTitle: string;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
  editContent: string;
  setEditContent: React.Dispatch<React.SetStateAction<string>>;
  handleSavePlan: () => void;
}

export const EditorDialog: React.FC<IEditorDialogParam> = ({
  editorOpen,
  setEditorOpen,
  loadDefaultToEditor,
  editTitle,
  setEditTitle,
  editContent,
  setEditContent,
  handleSavePlan,
}) => {
  return (
    <Dialog.Root open={editorOpen} onOpenChange={setEditorOpen}>
      <Dialog.Content style={{ maxWidth: 700 }} className="rounded-3xl p-0 overflow-hidden">
        <Box p="4" className="bg-slate-50 border-b">
          <Flex justify="between" align="center">
            <Text weight="bold">方案編輯器</Text>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button size="1" variant="soft" color="indigo">
                  <MagicWandIcon /> 參考預設內容 <ChevronDownIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => loadDefaultToEditor("plan_a")}>導入 方案 A</DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => loadDefaultToEditor("plan_b")}>導入 方案 B</DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => loadDefaultToEditor("plan_c")}>導入 方案 C</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Box>
        <Box p="4">
          <Flex direction="column" gap="3">
            <Box>
              <Text as="label" size="1" weight="bold" color="gray" mb="1">方案名稱</Text>
              <TextField.Root placeholder="輸入方案標題..." value={editTitle} onChange={e => setEditTitle(e.target.value)} className="bg-slate-100 border-none" />
            </Box>
            <Box>
              <Text as="label" size="1" weight="bold" color="gray" mb="1">TSV 數據內容</Text>
              <textarea
                className="w-full h-72 p-4 rounded-xl border-none font-mono text-xs focus:ring-2 ring-indigo-500 outline-none bg-slate-100"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                placeholder="活動名稱	產物	數量"
              />
            </Box>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">取消</Button>
            </Dialog.Close>
            <Button color="indigo" onClick={handleSavePlan}>確認保存</Button>
          </Flex>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
};
