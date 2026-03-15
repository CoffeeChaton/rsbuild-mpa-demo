import type { TMapPreference } from "./MapPreference";

// 0. 預設配置
export const DEFAULT_MAP_CONFIG: TMapPreference = {
	center: [25.0330, 121.5654], // 台北 101
	zoom: 13,
	tileLayer: "osm",
} as const;
