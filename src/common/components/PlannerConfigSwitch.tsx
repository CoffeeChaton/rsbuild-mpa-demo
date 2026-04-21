import { ArchiveIcon, PlusIcon, TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Button, Flex, IconButton, Popover, Text, TextField } from "@radix-ui/themes";
import React, { useCallback, useMemo, useState } from "react";
import { useConfigActions, useConfigs, useCurrentConfigId } from "../hooks/useConfig";

interface IConfigItemProps {
	config: { id: string, name: string };
	isActive: boolean;
	onSwitch: (id: string) => void;
	onRename: (id: string, name: string) => void;
	onDelete: (id: string) => void;
}

const ConfigItem: React.FC<IConfigItemProps> = React.memo(({ config, isActive, onSwitch, onRename, onDelete }) => {
	const [isRenaming, setIsRenaming] = useState(false);
	const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
	const [draftName, setDraftName] = useState(config.name);

	const handleSwitch = useCallback(() => {
		onSwitch(config.id);
	}, [config.id, onSwitch]);

	const handleStartRename = useCallback(() => {
		setDraftName(config.name);
		setIsConfirmingDelete(false);
		setIsRenaming(true);
	}, [config.name]);

	const handleDraftNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setDraftName(event.target.value);
	}, []);

	const handleCancelRename = useCallback(() => {
		setDraftName(config.name);
		setIsRenaming(false);
	}, [config.name]);

	const handleSubmitRename = useCallback(() => {
		const trimmedName = draftName.trim();
		if (!trimmedName) {
			return;
		}

		onRename(config.id, trimmedName);
		setIsRenaming(false);
	}, [config.id, draftName, onRename]);

	const handleRenameKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSubmitRename();
		}
		if (event.key === "Escape") {
			handleCancelRename();
		}
	}, [handleCancelRename, handleSubmitRename]);

	const handleStartDelete = useCallback(() => {
		setIsRenaming(false);
		setIsConfirmingDelete(true);
	}, []);

	const handleCancelDelete = useCallback(() => {
		setIsConfirmingDelete(false);
	}, []);

	const handleConfirmDelete = useCallback(() => {
		onDelete(config.id);
		setIsConfirmingDelete(false);
	}, [config.id, onDelete]);

	if (isRenaming) {
		return (
			<Flex direction="column" gap="2" p="2" className="rounded-md border border-(--indigo-6) bg-(--indigo-2)">
				<TextField.Root
					size="1"
					value={draftName}
					onChange={handleDraftNameChange}
					onKeyDown={handleRenameKeyDown}
					autoFocus
				/>
				<Flex justify="end" gap="2">
					<Button size="1" variant="soft" color="gray" onClick={handleCancelRename}>
						取消
					</Button>
					<Button size="1" color="indigo" onClick={handleSubmitRename}>
						確定
					</Button>
				</Flex>
			</Flex>
		);
	}

	if (isConfirmingDelete) {
		return (
			<Flex direction="column" gap="2" p="2" className="rounded-md border border-(--red-6) bg-(--red-2)">
				<Text size="1" weight="bold">
					確定要刪除「{config.name}」嗎？
				</Text>
				<Flex justify="end" gap="2">
					<Button size="1" variant="soft" color="gray" onClick={handleCancelDelete}>
						取消
					</Button>
					<Button size="1" color="red" onClick={handleConfirmDelete}>
						刪除
					</Button>
				</Flex>
			</Flex>
		);
	}

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
				<IconButton size="1" variant="ghost" color="gray" onClick={handleStartRename}>
					<UpdateIcon />
				</IconButton>
				{config.id !== "default" && (
					<IconButton size="1" variant="ghost" color="red" onClick={handleStartDelete}>
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

	const currentConfig = useMemo(() => configs.find(c => c.id === currentConfigId) ?? configs[0], [configs, currentConfigId]);

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
							{currentConfig.name}
						</Text>
					</Button>
				</Popover.Trigger>
				<Popover.Content style={popoverContentStyle}>
					<Flex direction="column" gap="3">
						<Flex justify="between" align="center" gap="3">
							<Text size="1" weight="bold" color="gray">
								本頁配置
							</Text>
							<Text size="1" color="gray" className="truncate">{currentConfig.id}</Text>
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
