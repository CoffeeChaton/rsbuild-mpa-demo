import React, { memo } from "react";
import { Text } from "@radix-ui/themes";
import type { TRowStatus } from "../../types";
import { TableCell } from "@/src/components/ui/table";

type TStatTone = "money" | "books";
type TStatVariant = "cost" | "cum";

const numStyle: React.CSSProperties = { whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", fontSize: "13px" };

const toneColorMap: Record<TStatTone, React.ComponentProps<typeof Text>["color"]> = {
	money: "amber",
	books: "blue",
};

const cumStatusStyle: Record<TRowStatus, { backgroundColor: string, textColor: React.ComponentProps<typeof Text>["color"] }> = {
	safe: { backgroundColor: "var(--green-3)", textColor: "green" },
	danger: { backgroundColor: "var(--red-3)", textColor: "red" },
	disabled: { backgroundColor: "transparent", textColor: "gray" },
};

export interface IStatCellProps {
	value: number;
	tone: TStatTone;
	variant: TStatVariant;
	status?: TRowStatus;
	showValue?: boolean;
}

export const StatCell: React.FC<IStatCellProps> = memo(({ value, tone, variant, status, showValue = true }) => {
	if (!showValue) {
		return (
			<TableCell className="text-right">
				<Text style={numStyle}>&nbsp;</Text>
			</TableCell>
		);
	}

	if (variant === "cost") {
		return (
			<TableCell className="text-right">
				<Text weight="bold" color={toneColorMap[tone]} style={numStyle}>
					{value.toLocaleString()}
				</Text>
			</TableCell>
		);
	}

	const { backgroundColor, textColor } = cumStatusStyle[status ?? "safe"];
	return (
		<TableCell className="text-right" style={{ backgroundColor, transition: "background-color 0.15s ease" }}>
			<Text weight="bold" color={textColor} style={numStyle}>
				Σ {value.toLocaleString()}
			</Text>
		</TableCell>
	);
});
StatCell.displayName = "StatCell";
