import { type FC, type MouseEvent, useCallback } from "react";
import { Button, DropdownMenu, Flex, IconButton, Text } from "@radix-ui/themes";
import { ChevronDownIcon, GearIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { usePlanContext } from "../context/PlanContext";

interface ICustomPlanItemProps {
	planKey: string;
	onSelect: (planKey: string) => void;
	onDelete: (planKey: string) => void;
}

const CustomPlanItem: FC<ICustomPlanItemProps> = ({ planKey, onSelect, onDelete }) => {
	const handleSelect = useCallback(() => onSelect(planKey), [onSelect, planKey]);
	const handleDelete = useCallback((e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		onDelete(planKey);
	}, [onDelete, planKey]);

	return (
		<DropdownMenu.Item key={planKey} onClick={handleSelect}>
			<Flex justify="between" width="100%" align="center">
				{planKey}
				<IconButton
					size="1"
					variant="ghost"
					color="red"
					onClick={handleDelete}
				>
					<TrashIcon />
				</IconButton>
			</Flex>
		</DropdownMenu.Item>
	);
};

export const PlanSwitcher: FC = () => {
	const {
		planName,
		setPlanName,
		customPlans,
		tsvB,
		setEditorOpen,
		deletePlan,
	} = usePlanContext();

	const handleCreatePlan = useCallback(() => {
		setEditorOpen(true, { targetId: null, title: `USR_${Date.now()}`, content: "" });
	}, [setEditorOpen]);
	const handleEditCurrentPlan = useCallback(() => {
		setEditorOpen(true, { targetId: planName, title: planName, content: tsvB });
	}, [planName, setEditorOpen, tsvB]);

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
				{Object.keys(customPlans).map(p => <CustomPlanItem key={p} planKey={p} onSelect={setPlanName} onDelete={deletePlan} />)}
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					color="indigo"
					onClick={handleCreatePlan}
				>
					<PlusIcon /> 新增方案...
				</DropdownMenu.Item>
				{customPlans[planName] !== undefined && (
					<DropdownMenu.Item onClick={handleEditCurrentPlan}>
						<GearIcon /> 編輯方案名稱/內容...
					</DropdownMenu.Item>
				)}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
};
