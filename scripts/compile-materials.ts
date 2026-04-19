// oxlint-disable no-console
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

const LocaleMapSchema: v.GenericSchema<Record<string, string>> = v.record(v.string(), v.string());
const ItemSourceSchema = v.object({
	type: v.number(),
	rare: v.number(),
	formulaType: v.fallback(v.nullable(v.string()), null),
	formula: v.fallback(v.nullable(v.record(v.string(), v.number())), null),
	sortId: v.optional(v.object({
		cn: v.fallback(v.nullable(v.number()), null),
	})),
});
type TItemSource = v.InferOutput<typeof ItemSourceSchema>;
const ItemSourceMapSchema: v.GenericSchema<Record<string, TItemSource>> = v.record(v.string(), ItemSourceSchema);

async function main(): Promise<void> {
	const result: Record<string, TItem> = {};

	const cn = v.parse(LocaleMapSchema, cnData);
	const tw = v.parse(LocaleMapSchema, twData);
	const us = v.parse(LocaleMapSchema, usData);
	const itemSourceRecord = v.parse(ItemSourceMapSchema, itemRawData);

	for (const [key, value] of Object.entries(itemSourceRecord)) {
		const rawInput = {
			type: value.type,
			rare: value.rare,
			formulaType: value.formulaType,
			formula: value.formula,
			sortId: value.sortId?.cn ?? null,
			name: {
				cn: cn[key] ?? "Unknown",
				tw: tw[key] ?? "Unknown",
				us: us[key] ?? "Unknown",
			},
		};

		// 使用 Valibot 驗證
		const resultParse = v.safeParse(ItemSchema, rawInput);

		if (resultParse.success) {
			result[key] = resultParse.output;
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
