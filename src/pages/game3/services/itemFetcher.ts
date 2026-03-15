// src/pages/game2/services/itemFetcher.ts
import * as v from "valibot";
import { ItemSchema, type TItem } from "../../../../shared/schemas/items.schema";

// 允許 Item 為 null (對應資料清洗時的 null)
const ItemMapSchema = v.record(v.string(), v.nullable(ItemSchema));

export const ITEM_DATA_KEY = `${import.meta.env.BASE_URL}data/item.json`.replace(/\/+/g, "/");

export interface IItemDataBundle {
	items: Record<string, TItem | null>;
	nameToIdMap: Map<string, string>; // { "先鋒晶片": "3211", "先锋芯片": "3211" }
	options: { label: string, value: string }[]; // 用於下拉選單
}

export const itemFetcher = async (url: string): Promise<IItemDataBundle> => {
	const response = await fetch(url);
	if (!response.ok) throw new Error("Failed to fetch item data");

	const rawData = await response.json();
	const items = v.parse(ItemMapSchema, rawData);

	const nameToIdMap = new Map<string, string>();
	const options: { label: string, value: string }[] = [];

	for (const [id, item] of Object.entries(items)) {
		if (!item) continue;
		// 建立多語系反查索引
		nameToIdMap.set(item.name.cn, id);
		nameToIdMap.set(item.name.tw, id);
		nameToIdMap.set(item.name.us, id);

		// 預設下拉選單顯示 tw
		options.push({ label: item.name.tw, value: item.name.tw });
	}

	return { items, nameToIdMap, options };
};
