import React, { useCallback, useMemo } from "react";
import { STORAGE_KEY } from "../config/constants";
import { useConfigs, useCurrentConfigId } from "../state/config";
import type { IConfigEntry } from "../types/config";
import { ConfigContext } from "./ConfigContext";

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [configsRaw, setConfigs] = useConfigs();
	const [currentConfigIdRaw, setCurrentConfigId] = useCurrentConfigId();

	const configs = useMemo(() => configsRaw ?? [], [configsRaw]);
	const currentConfigId = currentConfigIdRaw ?? "default";

	const switchConfig = useCallback((id: string) => {
		setCurrentConfigId(id);
	}, [setCurrentConfigId]);

	const addConfig = useCallback((name: string) => {
		const newConfig: IConfigEntry = {
			id: `config_${Date.now()}`,
			name: name || `新存檔 ${configs.length + 1}`,
			lastModified: Date.now(),
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
		localStorage.removeItem(`${STORAGE_KEY}_data_${id}`);
	}, [currentConfigId, setConfigs, setCurrentConfigId]);

	const renameConfig = useCallback((id: string, name: string) => {
		setConfigs(prev => (prev ?? []).map(c => c.id === id ? { ...c, name, lastModified: Date.now() } : c));
	}, [setConfigs]);

	const value = useMemo(() => ({
		currentConfigId,
		configs,
		switchConfig,
		addConfig,
		deleteConfig,
		renameConfig,
	}), [currentConfigId, configs, switchConfig, addConfig, deleteConfig, renameConfig]);

	return (
		<ConfigContext.Provider value={value}>
			{children}
		</ConfigContext.Provider>
	);
};
