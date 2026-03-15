import * as v from "valibot";
import { MapPreferenceSchema, type TMapPreference } from "../types/MapPreference";
import { DEFAULT_MAP_CONFIG } from "../types/MapUrl";

const STORAGE_KEY = "APP_MAP_USER_PREF";

/**
 * @description 從 localStorage 安全讀取配置
 */
export const loadMapPreference = (): TMapPreference => {
	const raw: unknown = localStorage.getItem(STORAGE_KEY);
	if (typeof raw !== "string") return DEFAULT_MAP_CONFIG;

	try {
		const json: unknown = JSON.parse(raw);
		const result = v.safeParse(MapPreferenceSchema, json);

		if (result.success) return result.output;
		console.warn("[MapStorage] Invalid schema, falling back to default.", result.issues);
	} catch {
		console.error("[MapStorage] JSON parse error.");
	}
	return DEFAULT_MAP_CONFIG;
};

/**
 * @description 儲存配置至 localStorage
 */
export const saveMapPreference = (config: TMapPreference): void => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};
