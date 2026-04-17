import { GearIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";
import { Flex, IconButton, Popover, SegmentedControl, Select, Text, Tooltip } from "@radix-ui/themes";
import { type TAccentColor, type TAppearanceMode, useAppTheme } from "../context/AppThemeContext";

export const AppThemeSwitch: React.FC = () => {
	const { accentColor, appearanceMode, setAccentColor, setAppearanceMode } = useAppTheme();
	const handleAppearanceChange = useCallback((value: TAppearanceMode) => setAppearanceMode(value), [setAppearanceMode]);
	const handleAccentChange = useCallback((value: TAccentColor) => setAccentColor(value), [setAccentColor]);

	return (
		<Popover.Root>
			<Tooltip content="主題與配色">
				<Popover.Trigger>
					<IconButton variant="soft" radius="full" className="cursor-pointer">
						<GearIcon />
					</IconButton>
				</Popover.Trigger>
			</Tooltip>
			<Popover.Content className="w-55">
				<Flex direction="column" gap="3">
					<Text size="1" weight="bold" color="gray">
						主題與配色
					</Text>
					<SegmentedControl.Root size="1" value={appearanceMode} onValueChange={handleAppearanceChange}>
						<SegmentedControl.Item value="light">
							<SunIcon />
						</SegmentedControl.Item>
						<SegmentedControl.Item value="dark">
							<MoonIcon />
						</SegmentedControl.Item>
						<SegmentedControl.Item value="system">Auto</SegmentedControl.Item>
					</SegmentedControl.Root>
					<Select.Root value={accentColor} onValueChange={handleAccentChange}>
						<Select.Trigger radius="full" variant="soft" />
						<Select.Content position="popper">
							<Select.Item value="indigo">Indigo</Select.Item>
							<Select.Item value="blue">Blue</Select.Item>
							<Select.Item value="grass">Grass</Select.Item>
							<Select.Item value="orange">Orange</Select.Item>
							<Select.Item value="crimson">Crimson</Select.Item>
						</Select.Content>
					</Select.Root>
				</Flex>
			</Popover.Content>
		</Popover.Root>
	);
};
