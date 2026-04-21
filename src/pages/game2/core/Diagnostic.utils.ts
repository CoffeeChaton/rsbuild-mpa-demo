import type { IDiagnosticEntry } from "../types/diag";
import type { IInventory } from "../types/inventory";
import type { IRowResult } from "../types/rowResult";
import { calculateBookStacksValue } from "./calculateBookStacksValue";

// 核心計算邏輯

export type TGetProductionSummary = (rows: IRowResult[], inventory: IInventory) => {
	moneyGap: number,
	booksGap: number,
	moneyDays: number | null,
	booksDays: number | null,
	estimatedDays: number | null,
};

export const getProductionSummary: TGetProductionSummary = (rows, inventory) => {
	const { money, bookStacks, avgMoneyProduction, avgBookProduction } = inventory;

	const books = calculateBookStacksValue(bookStacks);

	const totalMoneyNeed = rows.reduce((acc, r) => (r.calculate ? Math.max(acc, r.cumMoney) : acc), 0);
	const totalBooksNeed = rows.reduce((acc, r) => (r.calculate ? Math.max(acc, r.cumBooks) : acc), 0);

	const moneyGap = totalMoneyNeed - money;
	const booksGap = totalBooksNeed - books;

	const getDays = (gap: number, prod: number): number | null => (gap > 0 && prod > 0) ? Math.ceil(gap / prod) : null;
	const moneyDays = getDays(moneyGap, avgMoneyProduction);
	const booksDays = getDays(booksGap, avgBookProduction);

	return {
		moneyGap,
		booksGap,
		moneyDays,
		booksDays,
		estimatedDays: (moneyDays || booksDays) ? Math.max(moneyDays ?? 0, booksDays ?? 0) : null,
	};
};

export const generateLogs = (rows: IRowResult[], inventory: IInventory): IDiagnosticEntry[] => {
	const logs: IDiagnosticEntry[] = [];
	const { money, bookStacks, avgMoneyProduction, avgBookProduction } = inventory;

	const books = calculateBookStacksValue(bookStacks);

	rows.forEach((row, index) => {
		// 檢查 1：等級邏輯錯誤
		const isLevelInvalid = parseInt(row.e2) < parseInt(row.e1)
			|| (row.e1 === row.e2 && parseInt(row.l2) < parseInt(row.l1));
		if (isLevelInvalid) {
			logs.push({
				id: `err-${row.id}`,
				type: "error",
				emphasis: "normal",
				message: `第 ${index + 1} 行 [${row.name || "未命名"}]：目標等級不可低於當前。`,
			});
		}

		// 檢查 2：資源短缺提醒
		if (row.status === "danger") {
			const mGap = Math.max(0, row.cumMoney - money);
			const bGap = Math.max(0, row.cumBooks - books);
			const mDays = mGap > 0 && avgMoneyProduction > 0 ? Math.ceil(mGap / avgMoneyProduction) : null;
			const bDays = bGap > 0 && avgBookProduction > 0 ? Math.ceil(bGap / avgBookProduction) : null;

			const parts = [
				mGap > 0 && `LMD 缺 ${mGap.toLocaleString()}${mDays ? `(${mDays}天)` : ""}`,
				bGap > 0 && `EXP 缺 ${bGap.toLocaleString()}${bDays ? `(${bDays}天)` : ""}`,
			].filter(Boolean);

			logs.push({
				id: `info-${row.id}`,
				type: "info",
				emphasis: "loud",
				message: `[${row.name || `行${index + 1}`}] 仍需 ${parts.join("，")}`,
			});
		}
	});

	return logs.length ? logs : [{ id: "ok", type: "success", message: "一切正常", emphasis: "loud" }];
};
