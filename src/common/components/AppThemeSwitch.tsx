import { GearIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Popover, SegmentedControl, Select, Text, Tooltip } from "@radix-ui/themes";
import { useAppTheme } from "../context/AppThemeContext";

export const AppThemeSwitch: React.FC = () => {
	const { accentColor, appearanceMode, setAccentColor, setAppearanceMode } = useAppTheme();

	return (
		<Popover.Root>
			<Tooltip content="主題與配色">
				<Popover.Trigger>
					<IconButton variant="soft" radius="full" className="cursor-pointer">
						<GearIcon />
					</IconButton>
				</Popover.Trigger>
			</Tooltip>
			<Popover.Content style={{ width: 220, maxWidth: "calc(100vw - 24px)" }}>
				<Flex direction="column" gap="3">
					<Text size="1" weight="bold" color="gray">
						主題與配色
					</Text>
					<SegmentedControl.Root size="1" value={appearanceMode} onValueChange={(value) => setAppearanceMode(value as typeof appearanceMode)}>
						<SegmentedControl.Item value="light">
							<SunIcon />
						</SegmentedControl.Item>
						<SegmentedControl.Item value="dark">
							<MoonIcon />
						</SegmentedControl.Item>
						<SegmentedControl.Item value="system">Auto</SegmentedControl.Item>
					</SegmentedControl.Root>
					<Select.Root value={accentColor} onValueChange={(value) => setAccentColor(value as typeof accentColor)}>
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
