// src/pages/game2/components/DiagnosticPanel.tsx
import React from "react";
import { Badge, Box, Flex, IconButton, ScrollArea, Text } from "@radix-ui/themes";
import { CheckCircledIcon, ChevronDownIcon, ExclamationTriangleIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import type { IRowResult } from "../types";

interface IDiagnosticPanelProps {
  rows: IRowResult[];
}

type DiagnosticTone = "error" | "info" | "success";
type DiagnosticEmphasis = "quiet" | "normal" | "loud";

interface IDiagnosticEntry {
  id: string;
  type: DiagnosticTone;
  message: string;
  emphasis?: DiagnosticEmphasis;
  meta?: string;
}

export const DiagnosticPanel: React.FC<IDiagnosticPanelProps> = ({ rows }) => {
  const diagnostics = React.useMemo<IDiagnosticEntry[]>(() => {
    const logs: IDiagnosticEntry[] = [];

    rows.forEach((row, index) => {
      // 範例 1：邏輯錯誤 (Target < Current)
      if (
        parseInt(row.e2) < parseInt(row.e1)
        || (row.e1 === row.e2 && parseInt(row.l2) < parseInt(row.l1))
      ) {
        logs.push({
          id: `error-${row.id}-${index}`,
          type: "error",
          message: `第 ${index + 1} 行 [${row.name || "未命名"}]：目標等級不能低於當前等級。`,
          meta: `目前 ${row.e1} 精 ${row.l1} → 目標 ${row.e2} 精 ${row.l2}`,
          emphasis: "normal",
        });
      }

      if (row.status === "danger") {
        logs.push({
          id: `info-${row.id}-${index}`,
          type: "info",
          message: `計畫 [${row.name || `第 ${index + 1} 行`}] 預計消耗較大，建議調整庫存或資源。`,
          meta: undefined,
          emphasis: "loud",
        });
      }
    });

    if (logs.length === 0) {
      logs.push({
        id: "success-all-clear",
        type: "success",
        message: "一切 OK!",
        meta: `共 ${rows.length} 筆需求`,
        emphasis: "loud",
      });
    }

    return logs;
  }, [rows]);

  const [isExpanded, setIsExpanded] = React.useState(true);
  const errorCount = diagnostics.filter(d => d.type === "error").length;
  const infoCount = diagnostics.filter(d => d.type === "info").length;
  const toneStyles: Record<DiagnosticTone, { badge: string, icon: React.ReactNode, textClass: string }> = {
    error: {
      badge: "bg-red-100 text-red-700",
      icon: <ExclamationTriangleIcon />,
      textClass: "text-red-700",
    },
    info: {
      badge: "bg-blue-100 text-blue-700",
      icon: <InfoCircledIcon />,
      textClass: "text-slate-700",
    },
    success: {
      badge: "bg-emerald-100 text-emerald-700",
      icon: <CheckCircledIcon />,
      textClass: "text-emerald-700",
    },
  };

  return (
    <Box className="mt-4 rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur">
      <Flex align="center" justify="between" className="px-4 py-3">
        <Flex direction="column" className="min-w-0 gap-1">
          <Text size="1" color="gray" weight="bold">診斷列</Text>
          <Text size="3" weight="bold" className="truncate">
            {errorCount > 0 ? `需要修正 ${errorCount} 筆資料` : "所有輸入皆通過檢查"}
          </Text>
          <Text size="1" color="gray">
            {infoCount > 0 ? `另外 ${infoCount} 則提醒` : `共 ${rows.length} 筆需求`}
          </Text>
        </Flex>
        <Flex align="center" gap="2">
          <Badge color={errorCount ? "red" : "green"} variant={errorCount ? "solid" : "soft"}>
            {errorCount ? `${errorCount} Errors` : "0 Errors"}
          </Badge>
          {infoCount > 0 && (
            <Badge color="blue" variant="soft">
              {infoCount} Notes
            </Badge>
          )}
          <IconButton
            variant="ghost"
            onClick={() => setIsExpanded(v => !v)}
            aria-label={isExpanded ? "收合診斷列" : "展開診斷列"}
          >
            <ChevronDownIcon
              className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
            />
          </IconButton>
        </Flex>
      </Flex>

      <ScrollArea
        scrollbars="vertical"
        style={{
          maxHeight: isExpanded ? 180 : 0,
          transition: "max-height 200ms ease, opacity 150ms ease",
          opacity: isExpanded ? 1 : 0,
          padding: isExpanded ? "0 16px 16px" : "0 16px 0",
        }}
      >
        <Flex direction="column" gap="2" className="py-1">
          {diagnostics.map((log) => {
            const emphasisSize = log.emphasis === "loud" ? "3" : log.emphasis === "quiet" ? "1" : "2";
            const palette = toneStyles[log.type];

            return (
              <Flex
                key={log.id}
                align="start"
                gap="3"
                className="rounded-xl px-3 py-2 transition-colors hover:bg-slate-2"
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-base ${palette.badge}`}>
                  {palette.icon}
                </span>
                <Flex direction="column" className="min-w-0 gap-1">
                  <Text
                    size={emphasisSize as "1" | "2" | "3"}
                    weight={log.emphasis === "loud" ? "bold" : "regular"}
                    className={`${palette.textClass} leading-snug`}
                  >
                    {log.message}
                  </Text>
                  {log.meta && (
                    <Text size="1" color="gray">
                      {log.meta}
                    </Text>
                  )}
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      </ScrollArea>
    </Box>
  );
};
