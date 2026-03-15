import { useMemo } from "react";
import { generateLogs, getProductionSummary } from "../core/Diagnostic.utils";
import type { IInventory, IRowResult } from "../types";

export function useDiagnostics(
  rows: IRowResult[],
  inventory: IInventory,
) {
  const logs = useMemo(() => generateLogs(rows, inventory), [rows, inventory]);
  const summary = useMemo(() => getProductionSummary(rows, inventory), [rows, inventory]);

  return {
    logs,
    summary,
  };
}
