import React, { useCallback, useMemo } from "react";
import { Theme } from "@radix-ui/themes";
import { updateLastUsedConfigId, useNamespacedConfigLock, useNamespacedConfigs, useNamespacedCurrentConfigId } from "../state/config";
import type { IConfigEntry, TTheme } from "../types/config";
import {
	ConfigActionsContext,
	ConfigsContext,
	CurrentConfigIdContext,
	CurrentThemeContext,
	IsConfigLockedContext,
} from "./ConfigContext";

export interface IConfigProviderProps {
	children: React.ReactNode;
	/**
	 * 命名空間：用於隔離不同頁面的存檔列表
	 */
	namespace?: string | undefined;
	/**
	 * 強制指定配置 ID (代碼層級鎖定)
	 */
	overrideConfigId?: string | undefined;
}

export const ConfigProvider: React.FC<IConfigProviderProps> = ({ children, namespace = "", overrideConfigId }) => {
	const ns = namespace ?? "";

	const [configsRaw, setConfigs] = useNamespacedConfigs(ns);
	const [currentConfigIdRaw, setCurrentConfigId] = useNamespacedCurrentConfigId(ns);

	// 優先判定當前生效的 ID
	const currentConfigId = overrideConfigId ?? currentConfigIdRaw ?? "default";

	// 獲取該帳號的全域鎖定狀態
	const [isLockedRaw, setIsLocked] = useNamespacedConfigLock(currentConfigId, ns);

	const configs = useMemo(() => configsRaw ?? [], [configsRaw]);

	// 如果代碼強制指定，或者 localStorage 顯示該帳號已鎖定
	const isConfigLocked = !!overrideConfigId || isLockedRaw;

	const currentConfig = useMemo(
		() => configs.find(c => c.id === currentConfigId) || configs[0] || { id: "default", theme: "light" as const },
		[configs, currentConfigId],
	);

	const currentTheme = currentConfig.theme;

	const switchConfig = useCallback((id: string) => {
		setCurrentConfigId(id);
		updateLastUsedConfigId(id, ns);
	}, [ns, setCurrentConfigId]);

	const toggleLock = useCallback(() => {
		setIsLocked(prev => !prev);
	}, [setIsLocked]);

	const addConfig = useCallback((name: string) => {
		const newConfig: IConfigEntry = {
			id: `config_${Date.now()}`,
			name: name || `新存檔 ${configs.length + 1}`,
			lastModified: Date.now(),
			theme: "dark",
		};
		setConfigs(prev => [...(prev ?? []), newConfig]);
		switchConfig(newConfig.id);
	}, [configs.length, setConfigs, switchConfig]);

	const deleteConfig = useCallback((id: string) => {
		if (id === "default") return;
		setConfigs(prev => {
			if (!prev) return [];
			const next = prev.filter(c => c.id !== id);
			if (currentConfigIdRaw === id) {
				const fallbackId = next[0]?.id || "default";
				switchConfig(fallbackId);
			}
			return next;
		});
	}, [currentConfigIdRaw, setConfigs, switchConfig]);

	const renameConfig = useCallback((id: string, name: string) => {
		setConfigs(prev => (prev ?? []).map(c => c.id === id ? { ...c, name, lastModified: Date.now() } : c));
	}, [setConfigs]);

	const updateTheme = useCallback((id: string, theme: TTheme) => {
		setConfigs(prev => (prev ?? []).map(c => c.id === id ? { ...c, theme, lastModified: Date.now() } : c));
	}, [setConfigs]);

	const actions = useMemo(() => ({
		switchConfig,
		addConfig,
		deleteConfig,
		renameConfig,
		updateTheme,
		toggleLock,
	}), [switchConfig, addConfig, deleteConfig, renameConfig, updateTheme, toggleLock]);

	return (
		<ConfigActionsContext.Provider value={actions}>
			<ConfigsContext.Provider value={configs}>
				<CurrentConfigIdContext.Provider value={currentConfigId}>
					<IsConfigLockedContext.Provider value={isConfigLocked}>
						<CurrentThemeContext.Provider value={currentTheme}>
							<Theme appearance={currentTheme} hasBackground={false}>
								{children}
							</Theme>
						</CurrentThemeContext.Provider>
					</IsConfigLockedContext.Provider>
				</CurrentConfigIdContext.Provider>
			</ConfigsContext.Provider>
		</ConfigActionsContext.Provider>
	);
};
