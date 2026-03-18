import React, { useCallback, useMemo } from "react";
import { Theme } from "@radix-ui/themes";
import { useConfigs, useCurrentConfigId } from "../state/config";
import type { IConfigEntry, TTheme } from "../types/config";
import {
	ConfigActionsContext,
	ConfigsContext,
	CurrentConfigIdContext,
	CurrentThemeContext,
} from "./ConfigContext";

export interface IConfigProviderProps {
	children: React.ReactNode;
}

export const ConfigProvider: React.FC<IConfigProviderProps> = ({ children }) => {
	const [configsRaw, setConfigs] = useConfigs();
	const [currentConfigIdRaw, setCurrentConfigId] = useCurrentConfigId();

	const configs = useMemo(() => configsRaw ?? [], [configsRaw]);
	const currentConfigId = currentConfigIdRaw ?? "default";

	const currentConfig = useMemo(
		() => configs.find(c => c.id === currentConfigId) || configs[0] || { id: "default", theme: "light" as const },
		[configs, currentConfigId],
	);

	const currentTheme = currentConfig.theme;

	const switchConfig = useCallback((id: string) => {
		setCurrentConfigId(id);
	}, [setCurrentConfigId]);

	const addConfig = useCallback((name: string) => {
		const newConfig: IConfigEntry = {
			id: `config_${Date.now()}`,
			name: name || `新存檔 ${configs.length + 1}`,
			lastModified: Date.now(),
			theme: "dark",
		};
		setConfigs(prev => [...(prev ?? []), newConfig]);
		setCurrentConfigId(newConfig.id);
	}, [configs.length, setConfigs, setCurrentConfigId]);

	const deleteConfig = useCallback((id: string) => {
		if (id === "default") return;
		setConfigs(prev => {
			if (!prev) return [];
			const next = prev.filter(c => c.id !== id);
			if (currentConfigId === id) {
				setCurrentConfigId(next[0]?.id || "default");
			}
			return next;
		});
		// Note: We don't remove individual game data here because ConfigProvider is generic.
		// Individual pages should handle their own cleanup if they want.
	}, [currentConfigId, setConfigs, setCurrentConfigId]);

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
	}), [switchConfig, addConfig, deleteConfig, renameConfig, updateTheme]);

	return (
		<ConfigActionsContext.Provider value={actions}>
			<ConfigsContext.Provider value={configs}>
				<CurrentConfigIdContext.Provider value={currentConfigId}>
					<CurrentThemeContext.Provider value={currentTheme}>
						<Theme appearance={currentTheme} hasBackground={false}>
							{children}
						</Theme>
					</CurrentThemeContext.Provider>
				</CurrentConfigIdContext.Provider>
			</ConfigsContext.Provider>
		</ConfigActionsContext.Provider>
	);
};
