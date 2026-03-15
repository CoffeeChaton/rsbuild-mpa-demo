import * as v from "valibot";
import type { TAssertEqual } from "../../../type";

// 1. 定義基礎 類型
type _expected = {
	center: [number, number],
	zoom: number,
	tileLayer: "osm" | "satellite" | "dark",
};

// 2. 定義 Valibot Schema
const _schema: v.GenericSchema<_expected> = v.object({
	center: v.tuple([v.number(), v.number()]),
	zoom: v.pipe(v.number(), v.minValue(0), v.maxValue(20)),
	tileLayer: v.picklist(["osm", "satellite", "dark"]),
});

// 3. 高階型別鎖定 (靜態斷言)，若 Schema 實作與 Expected 不符，此處會噴出型別錯誤 (never)
type _type = TAssertEqual<v.InferOutput<typeof _schema>, _expected>;

// 4. export
export { _schema as MapPreferenceSchema };
export type { _type as TMapPreference };
