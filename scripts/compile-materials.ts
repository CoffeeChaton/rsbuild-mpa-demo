import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import * as v from "valibot";

// 假設匯入
import cnData from "./input/material.cn.json";
import twData from "./input/material.tw.json";
import usData from "./input/material.us.json";
import itemRawData from "./input/item.json";
import { ItemSchema, type TItem } from "../shared/schemas/items.schema";

const outputPath = "public/data/item.json";

async function main(): Promise<void> {
	const result: Record<string, TItem> = {};

	// 強型別化語言包
	const cn = cnData as Record<string, string>;
	const tw = twData as Record<string, string>;
	const us = usData as Record<string, string>;

	for (const [key, value] of Object.entries(itemRawData as Record<string, unknown>)) {
		// 預組裝資料
		const rawInput = {
			...(value as object),
			sortId: (value as { sortId: { cn: string } })?.sortId?.cn || null,
			name: {
				cn: cn[key] ?? "Unknown",
				tw: tw[key] ?? "Unknown",
				us: us[key] ?? "Unknown",
			},
		};

		// 使用 Valibot 驗證
		const resultParse = v.safeParse(ItemSchema, rawInput);

		if (resultParse.success) {
			result[key] = resultParse.output as TItem;
		} else {
			console.warn(`[Invalid Data] Key: ${key} | Issues: ${resultParse.issues.length}`);
		}
	}

	// CHECK OUTPUT
	for (const [key, value] of Object.entries(result)) {
		const resultParse = v.safeParse(ItemSchema, value);
		if (!resultParse.success) console.warn(`[輸出值不正確] Key: ${key}`, { value });
	}

	// 確保目錄存在並寫入
	await mkdir(dirname(outputPath), { recursive: true });
	await writeFile(outputPath, JSON.stringify(result, null, "\t"), "utf-8");

	console.log("🚀 Compilation finished using Valibot.");
}

main().catch(console.error);
