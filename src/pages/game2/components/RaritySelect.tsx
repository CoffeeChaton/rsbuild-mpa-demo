import * as React from "react";
import { Select } from "@radix-ui/themes";

interface IRaritySelectProps {
	value: number;
	onValueChange: (value: number) => void;
	disabled?: boolean;
}

/**
 * 選擇稀有度
 */
export const RaritySelect: React.FC<IRaritySelectProps> = ({
	value,
	onValueChange,
	disabled = false,
}) => {
	// 將數字轉為字串以符合 Select.Root 要求
	const stringValue = String(value);

	return (
		<Select.Root
			size="1"
			value={stringValue}
			onValueChange={(val) => onValueChange(Number(val))}
			disabled={disabled}
		>
			<Select.Trigger style={{ width: 45 }} variant="ghost" />
			<Select.Content style={{ minWidth: 80 }}>
				{/* 使用 textValue="6" 確保按鍵盤數字 6 可以快速選中 */}
				<Select.Item value="6" textValue="6">★ 6</Select.Item>
				<Select.Item value="5" textValue="5">★ 5</Select.Item>
				<Select.Item value="4" textValue="4">★ 4</Select.Item>
				<Select.Item value="3" textValue="3">★ 3</Select.Item>
				<Select.Item value="2" textValue="2">★ 2</Select.Item>
				<Select.Item value="1" textValue="1">★ 1</Select.Item>
			</Select.Content>
		</Select.Root>
	);
};
