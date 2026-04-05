import { type FC } from "react";
import { Button, DropdownMenu, Flex, IconButton, Text } from "@radix-ui/themes";
import { ChevronDownIcon, GearIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { usePlanContext } from "../context/PlanContext";

export const PlanSwitcher: FC = () => {
	const {
		planName,
		setPlanName,
		customPlans,
		tsvB,
		setEditorOpen,
		deletePlan,
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
									deletePlan(p); // 簡化為單一調用
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
						// 打開新方案
						setEditorOpen(true, { targetId: null, title: `USR_${Date.now()}`, content: "" });
					}}
				>
					<PlusIcon /> 新增方案...
				</DropdownMenu.Item>
				{customPlans[planName] !== undefined && (
					<DropdownMenu.Item
						onClick={() => {
							// 編輯現有方案
							setEditorOpen(true, { targetId: planName, title: planName, content: tsvB });
						}}
					>
						<GearIcon /> 編輯方案名稱/內容...
					</DropdownMenu.Item>
				)}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
};
