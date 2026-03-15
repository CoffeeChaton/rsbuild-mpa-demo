import { useMemo } from "react";
import { generateLogs, getProductionSummary } from "../core/Diagnostic.utils";
import type { IDiagnosticEntry, IInventory, IRowResult } from "../types";

export type TUseDiagnostics = (rows: IRowResult[], inventory: IInventory) => {
	logs: IDiagnosticEntry[],
	summary: {
		moneyGap: number,
		booksGap: number,
		moneyDays: number | null,
		booksDays: number | null,
		estimatedDays: number | null,
	},
};

export const useDiagnostics: TUseDiagnostics = (rows, inventory) => {
	const logs = useMemo(() => generateLogs(rows, inventory), [rows, inventory]);
	const summary = useMemo(() => getProductionSummary(rows, inventory), [rows, inventory]);

	return { logs, summary };
};
