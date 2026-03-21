import { cn } from "@/src/lib/utils";
import { TextField } from "@radix-ui/themes";
import type React from "react";
import type { IItem } from "../../types";

export interface TableInputProps {
	id: keyof IItem;
	value: string | number;
	width: number;
	type?: "text" | "number";
	errorMessage?: string | undefined;
	onChange: (field: keyof IItem, value: string) => void;
}

export const TableInput: React.FC<TableInputProps> = ({
	id,
	value,
	width,
	type = "number",
	errorMessage,
	onChange,
}) => (
	<TextField.Root
		type={type}
		size="1"
		style={{ width }}
		value={String(value ?? "")}
		variant={errorMessage ? "soft" : "surface"}
		color={errorMessage ? "red" : undefined}
		className={cn("transition-all", errorMessage && "ring-1 ring-red-500 shadow-sm")}
		onChange={(e) => onChange(id, e.target.value)}
	/>
);
