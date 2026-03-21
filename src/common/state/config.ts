// src/common/state/config.ts
import { useLocalStorage } from "foxact/use-local-storage";
import { useSessionStorage } from "foxact/use-session-storage";
import { CONFIG_LIST_KEY, CONFIG_LOCK_KEY, CURRENT_CONFIG_KEY, LAST_USED_CONFIG_KEY } from "../config/constants";
import type { IConfigEntry } from "../types/config";
import type { StateHookTuple } from "foxact/create-storage-hook";

// 初始值定義
export const INITIAL_CONFIGS: IConfigEntry[] = [
	{ id: "default", name: "預設存檔", lastModified: Date.now(), theme: "dark" },
];

/**
 * 存檔列表：使用 localStorage (全域同步)
 */
export const useNamespacedConfigs = (namespace: string = ""): StateHookTuple<IConfigEntry[]> => {
	const key = namespace ? `${CONFIG_LIST_KEY}_${namespace}` : CONFIG_LIST_KEY;
	return useLocalStorage<IConfigEntry[]>(key, INITIAL_CONFIGS);
};

/**
 * 當前選擇 ID：使用 sessionStorage (視窗隔離)
 * 但初始化時從 localStorage 讀取最後使用紀錄
 */
export const useNamespacedCurrentConfigId = (namespace: string = ""): StateHookTuple<string> => {
	const sKey = namespace ? `${CURRENT_CONFIG_KEY}_${namespace}` : CURRENT_CONFIG_KEY;
	const lKey = namespace ? `${LAST_USED_CONFIG_KEY}_${namespace}` : LAST_USED_CONFIG_KEY;

	const getInitialValue = () => {
		if (typeof window === "undefined") return "default";
		const sessionSaved = sessionStorage.getItem(sKey);
		if (sessionSaved) return JSON.parse(sessionSaved);

		const localSaved = localStorage.getItem(lKey);
		return localSaved ? JSON.parse(localSaved) : "default";
	};

	return useSessionStorage<string>(sKey, getInitialValue());
};

/**
 * 是否鎖定配置：使用 localStorage (🔥 關鍵：改回全域同步)
 * 理由：只要有人開啟鎖定，所有視窗都必須進入保護模式。
 */
export const useNamespacedConfigLock = (configId: string, namespace: string = ""): StateHookTuple<boolean> => {
	// 針對每個帳號 ID 獨立鎖定
	const key = `${CONFIG_LOCK_KEY}_${namespace}_${configId}`;
	return useLocalStorage<boolean>(key, false);
};

/**
 * 輔助：更新最後使用的配置 ID 到 localStorage
 */
export const updateLastUsedConfigId = (id: string, namespace: string = ""): void => {
	const lKey = namespace ? `${LAST_USED_CONFIG_KEY}_${namespace}` : LAST_USED_CONFIG_KEY;
	localStorage.setItem(lKey, JSON.stringify(id));
};
