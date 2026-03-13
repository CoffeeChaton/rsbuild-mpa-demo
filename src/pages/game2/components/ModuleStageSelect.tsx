import { Select } from "@radix-ui/themes";

interface IModuleStageSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  size?: "1" | "2" | "3";
  disabled?: boolean;
}

export const ModuleStageSelect: React.FC<IModuleStageSelectProps> = ({
  value,
  onValueChange,
  size = "1",
  disabled = false,
}) => {
  return (
    <Select.Root
      size={size}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Select.Trigger style={{ width: 45 }} />
      <Select.Content color="indigo">
        <Select.Item value="0">0</Select.Item>
        <Select.Item value="1">1</Select.Item>
        <Select.Item value="2">2</Select.Item>
        <Select.Item value="3">3</Select.Item>
      </Select.Content>
    </Select.Root>
  );
};
