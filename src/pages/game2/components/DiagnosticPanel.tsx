// src/pages/game2/components/DiagnosticPanel.tsx
import React, { memo, useState } from "react";
import { Badge, Box, Callout, Flex, IconButton, ScrollArea, Text } from "@radix-ui/themes";
import { ChevronDownIcon, ExclamationTriangleIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { getProductionSummary } from "../core/Diagnostic.utils";
import type { IDiagnosticEntry } from "../types";
import { useDiagnostics } from "../hooks/useDiagnostics";
import { useArsenalInventory, useArsenalRows } from "../context/ArsenalContext";

const SummaryBar = memo(({ summary }: { summary: ReturnType<typeof getProductionSummary> }) => (
	<Flex px="4" pb="3" direction="column" gap="2">
		<Flex gap="4" align="center" className="flex-wrap">
			<Box>
				<Text size="1" color="gray" as="div">預估剩餘</Text>
				<Text size="2" weight="bold">{summary.estimatedDays ?? "0"} 天</Text>
			</Box>
			<Box className="hidden sm:block" style={{ width: 1, height: 24, backgroundColor: "var(--gray-5)" }} />
			<Flex gap="1" wrap="wrap">
				{[
					{ label: "LMD", gap: summary.moneyGap, days: summary.moneyDays, color: "amber" as const },
					{ label: "EXP", gap: summary.booksGap, days: summary.booksDays, color: "blue" as const },
				].map((s) => (
					<Badge
						key={s.label}
						color={s.color}
						variant={s.gap > 0 ? "soft" : "surface"}
						size="2"
					>
						<Text weight="bold">{s.label}</Text>
						{s.gap > 0
							? ` 缺 ${s.gap.toLocaleString()} (${s.days ?? "?"}天)`
							: " 已達標"}
					</Badge>
				))}
			</Flex>
		</Flex>
	</Flex>
));

SummaryBar.displayName = "SummaryBar";

// 移除 isOpen，由父組件決定是否渲染
const DiagnosticList = memo(({ logs }: { logs: IDiagnosticEntry[] }) => {
	if (logs.length === 0) return null;

	return (
		<ScrollArea scrollbars="vertical" style={{ maxHeight: 200 }}>
			<Flex direction="column" gap="2" px="4" pb="4">
				{logs.map((log) => (
					<Callout.Root
						key={log.id}
						size="1"
						variant="surface"
						color={
							log.type === "error"
								? "pink" // "red"
								: log.type === "success"
								? "jade" // "green"
								: "blue" //  -> "info"
						}
					>
						<Callout.Icon>
							{log.type === "error" ? <ExclamationTriangleIcon /> : <InfoCircledIcon />}
						</Callout.Icon>
						<Callout.Text size="1" weight={log.emphasis === "loud" ? "bold" : "regular"}>
							{log.message}
						</Callout.Text>
					</Callout.Root>
				))}
			</Flex>
		</ScrollArea>
	);
});

DiagnosticList.displayName = "DiagnosticList";

export const DiagnosticPanel: React.FC = memo(() => {
	const { rows } = useArsenalRows();
	const { inventory } = useArsenalInventory();
	const [isExpanded, setIsExpanded] = useState(true);
	const { logs, summary } = useDiagnostics(rows, inventory);

	// 優化計數邏輯，避免重複 map/filter
	const counts = React.useMemo(() => {
		return logs.reduce((acc, log) => {
			if (log.type === "error") acc.error++;
			else if (log.type === "info" && log.id !== "ok") acc.info++;
			return acc;
		}, { error: 0, info: 0 });
	}, [logs]);

	return (
		<Box mt="4" style={{ border: "1px solid var(--gray-5)", borderRadius: "var(--radius-4)", overflow: "hidden" }} className="shrink-0 bg-(--gray)">
			<Flex align="center" justify="between" p="4">
				<Box>
					<Text size="1" color="gray" weight="bold" style={{ letterSpacing: "0.05em" }}>
						DIAGNOSTIC / 診斷
					</Text>
					<Text as="div" size="3" weight="bold">
						{counts.error > 0 ? `發現 ${counts.error} 處需要修正` : "數據校驗通過"}
					</Text>
				</Box>
				<Flex align="center" gap="1">
					<Badge color={counts.error ? "red" : "green"} variant={counts.error ? "solid" : "soft"}>
						{counts.error} Errors
					</Badge>
					{counts.info > 0 && <Badge color="blue" variant="soft">{counts.info} Notes</Badge>}
					<IconButton variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
						<ChevronDownIcon
							style={{
								transform: isExpanded ? "rotate(180deg)" : "none",
								transition: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
							}}
						/>
					</IconButton>
				</Flex>
			</Flex>

			<SummaryBar summary={summary} />

			{isExpanded && <DiagnosticList logs={logs} />}
		</Box>
	);
});
