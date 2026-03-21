import * as React from "react";
import { useCallback, useMemo } from "react";
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
	const stringValue = useMemo(() => String(value), [value]);

	const handleValueChange = useCallback((val: string) => {
		onValueChange(Number(val));
	}, [onValueChange]);

	const triggerStyle = useMemo(() => ({ width: 45 }), []);
	const contentStyle = useMemo(() => ({ minWidth: 80 }), []);

	return (
		<Select.Root
			size="1"
			value={stringValue}
			onValueChange={handleValueChange}
			disabled={disabled}
		>
			<Select.Trigger style={triggerStyle} variant="ghost" />
			<Select.Content style={contentStyle}>
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
