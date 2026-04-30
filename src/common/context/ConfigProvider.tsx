import type { TConfigEntry } from "../types/config";
import { useLocalStorage } from "foxact/use-local-storage";
import { useSessionStorage } from "foxact/use-session-storage";
import React, { useCallback, useMemo } from "react";
import { CONFIG_LIST_KEY, CURRENT_CONFIG_KEY, LAST_USED_CONFIG_KEY } from "../config/constants";
import {
	ConfigActionsContext,
	ConfigsContext,
	CurrentConfigIdContext,
} from "./ConfigContext";

export interface IConfigProviderProps {
	children: React.ReactNode;
	namespace?: string;
}

const createDefaultConfig = (): TConfigEntry => ({
	id: "default",
	name: "預設存檔",
	lastModified: Date.now(),
});

const getScopedKey = (baseKey: string, namespace: string): string => (namespace ? `${baseKey}_${namespace}` : baseKey);

export const ConfigProvider: React.FC<IConfigProviderProps> = ({ children, namespace = "" }) => {
	const listKey = getScopedKey(CONFIG_LIST_KEY, namespace);
	const currentKey = getScopedKey(CURRENT_CONFIG_KEY, namespace);
	const lastUsedKey = getScopedKey(LAST_USED_CONFIG_KEY, namespace);

	const [persistentConfigs] = useLocalStorage<TConfigEntry[]>(listKey, [createDefaultConfig()]);
	const [configs, setConfigs] = useSessionStorage<TConfigEntry[]>(listKey, persistentConfigs);

	const [lastUsedId] = useLocalStorage<string>(lastUsedKey, "default");
	const [currentConfigId, setCurrentConfigId] = useSessionStorage<string>(currentKey, lastUsedId);

	const activeConfigId = useMemo(
		() => (configs.some(config => config.id === currentConfigId) ? currentConfigId : (configs[0]?.id ?? "default")),
		[configs, currentConfigId],
	);

	const switchConfig = useCallback((id: string) => {
		setCurrentConfigId(id);
	}, [setCurrentConfigId]);

	const addConfig = useCallback((name: string) => {
		const newConfig: TConfigEntry = {
			id: `config_${Date.now()}`,
			name: name || `新存檔 ${configs.length + 1}`,
			lastModified: Date.now(),
		};
		setConfigs(prev => (prev ? [...prev, newConfig] : [newConfig]));
		switchConfig(newConfig.id);
	}, [configs.length, setConfigs, switchConfig]);

	const deleteConfig = useCallback((id: string) => {
		if (id === "default") return;
		setConfigs(prev => {
			if (!prev) return null;
			const next = prev.filter(c => c.id !== id);
			if (activeConfigId === id) {
				const fallbackId = next[0]?.id || "default";
				switchConfig(fallbackId);
			}
			return next;
		});
	}, [activeConfigId, setConfigs, switchConfig]);

	const renameConfig = useCallback((id: string, name: string) => {
		setConfigs(prev => (prev ? prev.map(c => c.id === id ? { ...c, name, lastModified: Date.now() } : c) : null));
	}, [setConfigs]);

	const actions = useMemo(() => ({
		switchConfig,
		addConfig,
		deleteConfig,
		renameConfig,
	}), [switchConfig, addConfig, deleteConfig, renameConfig]);

	return (
		<ConfigActionsContext value={actions}>
			<ConfigsContext value={configs}>
				<CurrentConfigIdContext value={activeConfigId}>
					{children}
				</CurrentConfigIdContext>
			</ConfigsContext>
		</ConfigActionsContext>
	);
};
