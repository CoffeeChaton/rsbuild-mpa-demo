import type { TMapPreference } from "./MapPreference";

// 底圖 URL 映射
export const TILE_LAYERS: Record<TMapPreference["tileLayer"], string> = {
	osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
	dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};
