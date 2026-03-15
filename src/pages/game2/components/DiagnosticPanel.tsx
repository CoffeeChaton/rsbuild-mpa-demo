// src/pages/game2/components/DiagnosticPanel.tsx
import React, { useMemo, useState } from "react";
import { Badge, Box, Callout, Flex, IconButton, ScrollArea, Text } from "@radix-ui/themes";
import { ChevronDownIcon, ExclamationTriangleIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { generateLogs, getProductionSummary } from "../core/Diagnostic.utils";
import type { IDiagnosticEntry, IDiagnosticPanelProps } from "../types";

const SummaryBar = ({ summary }: { summary: ReturnType<typeof getProductionSummary> }) => (
  <Flex
    px="4"
    pb="3"
    direction="column" // 預設垂直排布
    gap="2"
  >
    {/* 預估天數與數據標籤全部靠左 */}
    <Flex gap="4" align="center">
      <Box>
        <Text size="1" color="gray" as="div">預估剩餘</Text>
        <Text size="2" weight="bold">
          {summary.estimatedDays ?? "—"} 天
        </Text>
      </Box>

      {/* 垂直分割線感 (選用) */}
      <Box style={{ width: 1, height: 24, backgroundColor: "var(--gray-5)" }} />

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
);

const DiagnosticList = ({ logs, isOpen }: { logs: IDiagnosticEntry[], isOpen: boolean }) => {
  if (!isOpen) return null;

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
};

export const DiagnosticPanel: React.FC<IDiagnosticPanelProps> = ({ rows, inventory }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const summary = useMemo(() => getProductionSummary(rows, inventory), [rows, inventory]);
  const logs = useMemo(() => generateLogs(rows, inventory), [rows, inventory]);

  const errorCount = logs.filter((d) => d.type === "error").length;
  const infoCount = logs.filter((d) => d.type === "info" && d.id !== "ok").length;

  return (
    <Box mt="4" p="0" style={{ border: "1px solid var(--gray-5)", borderRadius: "var(--radius-4)", overflow: "hidden" }}>
      <Flex align="center" justify="between" p="4">
        <Box>
          <Text size="1" color="gray" weight="bold" style={{ letterSpacing: "0.05em" }}>DIAGNOSTIC / 診斷</Text>
          <Text as="div" size="3" weight="bold">
            {errorCount > 0 ? `發現 ${errorCount} 處需要修正` : "數據校驗通過"}
          </Text>
        </Box>
        <Flex align="center" gap="1">
          <Badge color={errorCount ? "red" : "green"} variant={errorCount ? "solid" : "soft"}>{errorCount} Errors</Badge>
          {infoCount > 0 && <Badge color="blue" variant="soft">{infoCount} Notes</Badge>}
          <IconButton variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
            <ChevronDownIcon style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
          </IconButton>
        </Flex>
      </Flex>

      <SummaryBar summary={summary} />
      <DiagnosticList logs={logs} isOpen={isExpanded} />
    </Box>
  );
};
