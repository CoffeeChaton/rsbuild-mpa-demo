import React from "react";
import { Button, DropdownMenu, Flex, IconButton, Text } from "@radix-ui/themes";
import { ChevronDownIcon, GearIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import type { Dispatch, SetStateAction } from "react";

interface IPlanSwitcher {
  planName: string;
  setPlanName: Dispatch<SetStateAction<string>>;
  customPlans: Record<string, string>;
  setCustomPlans: Dispatch<SetStateAction<Record<string, string>>>;
  setEditTargetId: Dispatch<SetStateAction<string | null>>;
  setEditTitle: Dispatch<SetStateAction<string>>;
  setEditContent: Dispatch<SetStateAction<string>>;
  setEditorOpen: Dispatch<SetStateAction<boolean>>;
  tsvB: string;
}

export const PlanSwitcher: React.FC<IPlanSwitcher> = ({
  planName,
  setPlanName,
  customPlans,
  setCustomPlans,
  setEditTargetId,
  setEditTitle,
  setEditContent,
  setEditorOpen,
  tsvB,
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="outline">
          <Text size="2" weight="bold" color="indigo">
            方案: {planName.replace("plan_", "").toUpperCase()}
          </Text>
          <ChevronDownIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content variant="soft" color="indigo" className="min-w-[180px]">
        <DropdownMenu.Label>預設方案</DropdownMenu.Label>
        {["plan_a", "plan_b", "plan_c"].map(p => <DropdownMenu.Item key={p} onClick={() => setPlanName(p)}>{p.toUpperCase()}</DropdownMenu.Item>)}
        <DropdownMenu.Separator />
        <DropdownMenu.Label>自定義方案</DropdownMenu.Label>
        {Object.keys(customPlans).map(p => (
          <DropdownMenu.Item key={p} onClick={() => setPlanName(p)}>
            <Flex justify="between" width="100%" align="center">
              {p}
              <IconButton
                size="1"
                variant="ghost"
                color="red"
                onClick={(e) => {
                  e.stopPropagation();
                  const n = { ...customPlans };
                  delete n[p];
                  setCustomPlans(n);
                  if (planName === p) setPlanName("plan_a");
                }}
              >
                <TrashIcon />
              </IconButton>
            </Flex>
          </DropdownMenu.Item>
        ))}
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          color="indigo"
          onClick={() => {
            setEditTargetId(null);
            setEditTitle(`USR_${new Date().getTime().toString().slice(-4)}`);
            setEditContent("");
            setEditorOpen(true);
          }}
        >
          <PlusIcon /> 新增方案...
        </DropdownMenu.Item>
        {customPlans[planName] !== undefined && (
          <DropdownMenu.Item
            onClick={() => {
              setEditTargetId(planName);
              setEditTitle(planName);
              setEditContent(tsvB);
              setEditorOpen(true);
            }}
          >
            <GearIcon /> 編輯方案名稱/內容...
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
