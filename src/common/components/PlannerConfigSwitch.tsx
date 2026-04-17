import React, { useCallback, useMemo, useState } from "react";
import { ArchiveIcon, PlusIcon, TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Button, Flex, IconButton, Popover, Text, TextField } from "@radix-ui/themes";
import { useConfigActions, useConfigs, useCurrentConfigId } from "../hooks/useConfig";

interface IConfigItemProps {
	config: { id: string, name: string };
	isActive: boolean;
	onSwitch: (id: string) => void;
	onRename: (id: string, name: string) => void;
	onDelete: (id: string) => void;
}

const ConfigItem: React.FC<IConfigItemProps> = React.memo(({ config, isActive, onSwitch, onRename, onDelete }) => {
	const handleSwitch = useCallback(() => {
		onSwitch(config.id);
	}, [config.id, onSwitch]);

	const handleRename = useCallback(() => {
		const name = prompt("重新命名存檔", config.name);
		if (name) {
			onRename(config.id, name);
		}
	}, [config.id, config.name, onRename]);

	const handleDelete = useCallback(() => {
		if (confirm(`確定要刪除「${config.name}」嗎？`)) {
			onDelete(config.id);
		}
	}, [config.id, config.name, onDelete]);

	return (
		<Flex
			align="center"
			justify="between"
			gap="2"
			p="1"
			className={`rounded-md ${isActive ? "bg-(--accent-3) shadow-sm" : "hover:bg-(--gray-3)"}`}
		>
			<Text size="2" className="flex-1 truncate px-2 py-1 cursor-pointer" onClick={handleSwitch}>
				{config.name}
			</Text>
			<Flex gap="1">
				<IconButton size="1" variant="ghost" color="gray" onClick={handleRename}>
					<UpdateIcon />
				</IconButton>
				{config.id !== "default" && (
					<IconButton size="1" variant="ghost" color="red" onClick={handleDelete}>
						<TrashIcon />
					</IconButton>
				)}
			</Flex>
		</Flex>
	);
});

ConfigItem.displayName = "ConfigItem";

export const PlannerConfigSwitch: React.FC = () => {
	const configs = useConfigs();
	const currentConfigId = useCurrentConfigId();
	const { switchConfig, addConfig, deleteConfig, renameConfig } = useConfigActions();
	const [newName, setNewName] = useState("");
	const [isAdding, setIsAdding] = useState(false);

	const currentConfig = useMemo(() => configs.find(c => c.id === currentConfigId) || configs[0], [configs, currentConfigId]);

	const handleAdd = useCallback(() => {
		const trimmedName = newName.trim();
		if (!trimmedName) return;
		addConfig(trimmedName);
		setNewName("");
		setIsAdding(false);
	}, [addConfig, newName]);
	const handleNewNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setNewName(e.target.value);
	}, []);
	const handleNewNameKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") handleAdd();
	}, [handleAdd]);
	const handleCancelAdding = useCallback(() => {
		setIsAdding(false);
	}, []);
	const handleStartAdding = useCallback(() => {
		setIsAdding(true);
	}, []);

	const popoverContentStyle = useMemo(() => ({ width: 300, maxWidth: "calc(100vw - 24px)" }), []);

	return (
		<Flex align="center" gap="2">
			<Popover.Root>
				<Popover.Trigger>
					<Button variant="outline" color="indigo" size="2" className="cursor-pointer max-w-full">
						<ArchiveIcon />
						<Text weight="bold" className="max-w-32 truncate">
							{currentConfig?.name}
						</Text>
					</Button>
				</Popover.Trigger>
				<Popover.Content style={popoverContentStyle}>
					<Flex direction="column" gap="3">
						<Flex justify="between" align="center" gap="3">
							<Text size="1" weight="bold" color="gray">
								本頁配置
							</Text>
							{currentConfig && <Text size="1" color="gray" className="truncate">{currentConfig.id}</Text>}
						</Flex>

						<Flex direction="column" gap="1">
							{configs.map(config => (
								<ConfigItem
									key={config.id}
									config={config}
									isActive={config.id === currentConfigId}
									onSwitch={switchConfig}
									onRename={renameConfig}
									onDelete={deleteConfig}
								/>
							))}
						</Flex>

						{isAdding
							? (
								<Flex gap="2">
									<TextField.Root
										size="1"
										className="flex-1"
										placeholder="新存檔名稱"
										value={newName}
										onChange={handleNewNameChange}
										onKeyDown={handleNewNameKeyDown}
									/>
									<Button size="1" color="indigo" onClick={handleAdd}>確定</Button>
									<Button size="1" variant="soft" color="gray" onClick={handleCancelAdding}>
										取消
									</Button>
								</Flex>
							)
							: (
								<Button variant="ghost" size="1" color="indigo" onClick={handleStartAdding}>
									<PlusIcon /> 新增存檔
								</Button>
							)}
					</Flex>
				</Popover.Content>
			</Popover.Root>
		</Flex>
	);
};
