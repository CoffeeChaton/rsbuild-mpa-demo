// src/pages/game2/components/ConfigSwitch.tsx
import React, { useState } from "react";
import { Button, Flex, IconButton, Popover, Text, TextField } from "@radix-ui/themes";
import { ArchiveIcon, PlusIcon, TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useConfig } from "../context/ConfigContext";

export const ConfigSwitch: React.FC = () => {
	const { configs, currentConfigId, switchConfig, addConfig, deleteConfig, renameConfig } = useConfig();
	const [newName, setNewName] = useState("");
	const [isAdding, setIsAdding] = useState(false);

	const currentConfig = configs.find(c => c.id === currentConfigId) || configs[0];

	const handleAdd = () => {
		if (newName.trim()) {
			addConfig(newName.trim());
			setNewName("");
			setIsAdding(false);
		}
	};

	return (
		<Flex align="center" gap="2">
			<Popover.Root>
				<Popover.Trigger>
					<Button variant="surface" color="gray" size="2">
						<ArchiveIcon />
						<Text weight="bold" className="max-w-[100px] truncate">
							{currentConfig?.name}
						</Text>
					</Button>
				</Popover.Trigger>
				<Popover.Content style={{ width: 280 }}>
					<Flex direction="column" gap="3">
						<Text size="1" weight="bold" color="gray">
							存檔管理
						</Text>

						<Flex direction="column" gap="1">
							{configs.map(config => (
								<Flex key={config.id} align="center" justify="between" gap="2" p="1" className={`rounded-md ${config.id === currentConfigId ? "bg-blue-100" : "hover:bg-gray-100"}`}>
									<Text
										size="2"
										className="flex-1 cursor-pointer truncate px-2 py-1"
										onClick={() =>
											switchConfig(config.id)}
									>
										{config.name}
									</Text>
									<Flex gap="1">
										<IconButton
											size="1"
											variant="ghost"
											color="gray"
											onClick={() => {
												const name = prompt("重新命名存檔", config.name);
												if (name) {
													renameConfig(config.id, name);
												}
											}}
										>
											<UpdateIcon />
										</IconButton>
										{config.id !== "default" && (
											<IconButton
												size="1"
												variant="ghost"
												color="red"
												onClick={() => {
													if (confirm(`確定要刪除「${config.name}」嗎？`)) {
														deleteConfig(config.id);
													}
												}}
											>
												<TrashIcon />
											</IconButton>
										)}
									</Flex>
								</Flex>
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
										onChange={e => setNewName(e.target.value)}
										onKeyDown={e => e.key === "Enter" && handleAdd()}
									/>
									<Button size="1" onClick={handleAdd}>確定</Button>
									<Button size="1" variant="soft" color="gray" onClick={() => setIsAdding(false)}>取消</Button>
								</Flex>
							)
							: (
								<Button variant="ghost" size="1" onClick={() => setIsAdding(true)}>
									<PlusIcon /> 新增存檔
								</Button>
							)}
					</Flex>
				</Popover.Content>
			</Popover.Root>
		</Flex>
	);
};
