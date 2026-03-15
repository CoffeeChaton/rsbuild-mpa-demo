import * as v from "valibot";
import type { TAssertEqual } from "./utils";

// 1. 手動定義的標準介面 (Single Source of Truth)
interface IMapPreferenceDef {
	center: [number, number]; // [lat, lng]
	zoom: number;
	tileLayer: "osm" | "satellite" | "dark";
}

// 2. 定義 Valibot Schema
export const MapPreferenceSchema = v.object({
	center: v.tuple([v.number(), v.number()]),
	zoom: v.pipe(v.number(), v.minValue(0), v.maxValue(20)),
	tileLayer: v.picklist(["osm", "satellite", "dark"]),
});

// 3. 高階型別鎖定 (靜態斷言)
type TInferred = v.InferOutput<typeof MapPreferenceSchema>;
export type TMapPreference = TAssertEqual<TInferred, IMapPreferenceDef>;

// 預設配置
export const DEFAULT_MAP_CONFIG: IMapPreferenceDef = {
	center: [25.0330, 121.5654], // 台北 101
	zoom: 13,
	tileLayer: "osm",
} as const;

// 底圖 URL 映射
export const TILE_LAYERS: Record<IMapPreferenceDef["tileLayer"], string> = {
	osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
	dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};

/**
 * @description 簡化版 URL Schema，帶有非致命錯誤回退機制
 */
export const MapUrlSchema = v.object({
	lat: v.fallback(v.pipe(v.number(), v.minValue(-90), v.maxValue(90)), DEFAULT_MAP_CONFIG.center[0]),
	lng: v.fallback(v.pipe(v.number(), v.minValue(-180), v.maxValue(180)), DEFAULT_MAP_CONFIG.center[1]),
	z: v.fallback(v.pipe(v.number(), v.minValue(0), v.maxValue(20)), DEFAULT_MAP_CONFIG.zoom),
	l: v.fallback(v.picklist(["osm", "satellite", "dark"]), DEFAULT_MAP_CONFIG.tileLayer),
});

export type TMapUrlState = v.InferOutput<typeof MapUrlSchema>;
