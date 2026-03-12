import React, { useState } from "react";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // 傳入編輯所需的初始資訊
  initialData: {
    targetId: string | null,
    title: string,
    content: string,
  };
  // 外部注入的行為
  onSave: (title: string, content: string, targetId: string | null) => void;
  loadDefault: (planId: string) => Promise<string>;
}

export const EditorDialog: React.FC<IEditorDialogParam> = ({
  open,
  onOpenChange,
  initialData,
  onSave,
  loadDefault,
}) => {
  // 內部受控，輸入時不影響外界
  const [tempTitle, setTempTitle] = useState(initialData.title);
  const [tempContent, setTempContent] = useState(initialData.content);

  const handleInternalSave = () => {
    onSave(tempTitle, tempContent, initialData.targetId);
  };

  const handleImportDefault = async (p: string) => {
    const raw = await loadDefault(p);
    setTempContent(raw);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
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
                <DropdownMenu.Item onClick={() => handleImportDefault("plan_a")}>導入 方案 A</DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleImportDefault("plan_b")}>導入 方案 B</DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleImportDefault("plan_c")}>導入 方案 C</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Box>
        <Box p="4">
          <Flex direction="column" gap="3">
            <Box>
              <Text as="label" size="1" weight="bold" color="gray" mb="1">方案名稱</Text>
              <TextField.Root
                placeholder="輸入方案標題..."
                className="bg-slate-100 border-none"
                value={tempTitle}
                onChange={e => setTempTitle(e.target.value)}
              />
            </Box>
            <Box>
              <Text as="label" size="1" weight="bold" color="gray" mb="1">TSV 數據內容</Text>
              <textarea
                placeholder="活動名稱	產物	數量"
                className="w-full h-72 p-4 rounded-xl border-none font-mono text-xs focus:ring-2 ring-indigo-500 outline-none bg-slate-100"
                value={tempContent}
                onChange={e => setTempContent(e.target.value)}
              />
            </Box>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">取消</Button>
            </Dialog.Close>
            <Button color="indigo" onClick={handleInternalSave}>確認保存</Button>
          </Flex>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
};
