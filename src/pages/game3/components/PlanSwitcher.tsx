import React from "react";
import { Button, DropdownMenu, Flex, IconButton, Text } from "@radix-ui/themes";
import { ChevronDownIcon, GearIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import type { Dispatch, SetStateAction } from "react";
import type { TEditor } from "../type";
import { usePlanContext } from "../context/PlanContext";

interface IPlanSwitcher {
  setEditor: Dispatch<SetStateAction<TEditor>>;
}

export const PlanSwitcher: React.FC<IPlanSwitcher> = ({
  setEditor,
}) => {
  const {
    planName,
    setPlanName,
    customPlans,
    setCustomPlans,
    tsvB,
  } = usePlanContext();

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
            setEditor({
              open: true,
              targetId: null,
              title: `USR_${Date.now()}`,
              content: "",
            });
          }}
        >
          <PlusIcon /> 新增方案...
        </DropdownMenu.Item>
        {customPlans[planName] !== undefined && (
          <DropdownMenu.Item
            onClick={() => {
              setEditor({
                open: true,
                targetId: planName,
                title: planName,
                content: tsvB,
              });
            }}
          >
            <GearIcon /> 編輯方案名稱/內容...
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
