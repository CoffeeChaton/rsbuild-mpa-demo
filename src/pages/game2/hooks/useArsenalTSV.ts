// src/pages/game2/hooks/useArsenalTSV.ts
import type { IItem, IRowResult } from "../types";
import { TSV_HEADER, TSV_HEADER_KEYWORDS } from "../config/constants";

export type TUseArsenalTSV = (setItems: (items: IItem[]) => void, rows: IRowResult[]) => {
	handleImport: () => Promise<void>,
	handleExport: () => void,
};

export const useArsenalTSV: TUseArsenalTSV = (setItems, rows) => {
	const handleImport = async () => {
		try {
			const text = await navigator.clipboard.readText();
			const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
			const dataLines = TSV_HEADER_KEYWORDS.some(k => lines[0].includes(k)) ? lines.slice(1) : lines;
			const newItems: IItem[] = dataLines.map(line => {
				const c = line.split("\t");
				return {
					id: crypto.randomUUID(),
					calculate: c[0]?.trim() === "O",
					rarity: Number(c[1]) || NaN,
					name: c[2] || "",
					note: c[3] || "",
					moduleFrom: c[4] || "0",
					moduleTo: c[5] || "3",
					e1: c[6] || "0",
					l1: c[7] || "1",
					e2: c[8] || "0",
					l2: c[9] || "1",
				};
			});
			setItems(newItems);
		} catch (error) {
			console.error("貼上失敗", error);
			alert("貼上失敗");
		}
	};

	const handleExport = () => {
		try {
			const header = TSV_HEADER;
			const body = rows.map(r =>
				`${
					r.calculate ? "O" : "X"
				}\t${r.rarity}\t${r.name}\t${r.note}\t${r.moduleFrom}\t${r.moduleTo}\t${r.e1}\t${r.l1}\t${r.e2}\t${r.l2}\t${r.costMoney}\t${r.costBooks}\t${r.cumMoney}\t${r.cumBooks}`
			).join("\n");
			navigator.clipboard.writeText(header + "\n" + body);
		} catch (error) {
			console.error("複製失敗", error);
			alert("複製失敗");
		}
	};

	return { handleImport, handleExport };
};
