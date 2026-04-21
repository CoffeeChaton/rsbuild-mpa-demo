import type { IItemDataBundle } from "../services/itemFetcher";
import * as v from "valibot";

const SourceJsonSchema = v.record(v.string(), v.number());

export function analyzeSource(
	content: string,
	bundle: IItemDataBundle | undefined,
	isJson: boolean,
): Map<string, number> {
	const map = new Map<string, number>();
	if (!content || !bundle) return map;

	if (isJson) {
		try {
			const data = v.parse(SourceJsonSchema, JSON.parse(content));
			return new Map(Object.entries(data));
		} catch {
			return map;
		}
	} else {
		// TSV 處理

		const typedBundle = bundle;
		content.trim().split("\n").forEach(l => {
			const c = l.split("\t");
			if (c.length < 3) return;

			const id = typedBundle.nameToIdMap.get(c[1]) ?? c[1];
			const val = Number(c[2]) || 0;

			map.set(id, (map.get(id) ?? 0) + val);
		});
	}

	return map;
}
