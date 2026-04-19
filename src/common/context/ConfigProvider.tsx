import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as v from "valibot";
import { CONFIG_LIST_KEY, CURRENT_CONFIG_KEY, LAST_USED_CONFIG_KEY } from "../config/constants";
import { ConfigEntrySchema, type TConfigEntry } from "../types/config";
import {
	ConfigActionsContext,
	ConfigsContext,
	CurrentConfigIdContext,
} from "./ConfigContext";

export interface IConfigProviderProps {
	children: React.ReactNode;
	namespace?: string | undefined;
}

const createDefaultConfig = (): TConfigEntry => ({
	id: "default",
	name: "預設存檔",
	lastModified: Date.now(),
});

const ConfigEntryArraySchema = v.array(ConfigEntrySchema);
const parseConfigs = (raw: string | null): TConfigEntry[] | null => {
	if (!raw) return null;
	try {
		const parsed: TConfigEntry[] = v.parse(ConfigEntryArraySchema, JSON.parse(raw));
		return parsed.length > 0 ? parsed : null;
	} catch {
		return null;
	}
};

const parseCurrentId = (raw: string | null): string | null => {
	if (!raw) return null;
	try {
		return v.parse(v.string(), raw);
	} catch {
		return null;
	}
};

const getScopedKey = (baseKey: string, namespace: string): string => (namespace ? `${baseKey}_${namespace}` : baseKey);

export const ConfigProvider: React.FC<IConfigProviderProps> = ({ children, namespace = "" }) => {
	const ns = namespace ?? "";
	const listKey = getScopedKey(CONFIG_LIST_KEY, ns);
	const currentKey = getScopedKey(CURRENT_CONFIG_KEY, ns);
	const lastUsedKey = getScopedKey(LAST_USED_CONFIG_KEY, ns);

	const [configs, setConfigs] = useState<TConfigEntry[]>(() => {
		if (typeof window === "undefined") return [createDefaultConfig()];
		return (
			parseConfigs(window.sessionStorage.getItem(listKey))
				?? parseConfigs(window.localStorage.getItem(listKey))
				?? [createDefaultConfig()]
		);
	});

	const [currentConfigId, setCurrentConfigId] = useState<string>(() => {
		if (typeof window === "undefined") return "default";
		return (
			parseCurrentId(window.sessionStorage.getItem(currentKey))
				?? parseCurrentId(window.localStorage.getItem(lastUsedKey))
				?? "default"
		);
	});

	const activeConfigId = useMemo(
		() => (configs.some(config => config.id === currentConfigId) ? currentConfigId : (configs[0]?.id ?? "default")),
		[configs, currentConfigId],
	);

	useEffect(() => {
		if (typeof window === "undefined") return;
		window.sessionStorage.setItem(listKey, JSON.stringify(configs));
	}, [configs, listKey]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		window.sessionStorage.setItem(currentKey, JSON.stringify(activeConfigId));
	}, [activeConfigId, currentKey]);

	const switchConfig = useCallback((id: string) => {
		setCurrentConfigId(id);
	}, []);

	const addConfig = useCallback((name: string) => {
		const newConfig: TConfigEntry = {
			id: `config_${Date.now()}`,
			name: name || `新存檔 ${configs.length + 1}`,
			lastModified: Date.now(),
		};
		setConfigs(prev => [...prev, newConfig]);
		switchConfig(newConfig.id);
	}, [configs.length, setConfigs, switchConfig]);

	const deleteConfig = useCallback((id: string) => {
		if (id === "default") return;
		setConfigs(prev => {
			const next = prev.filter(c => c.id !== id);
			if (activeConfigId === id) {
				const fallbackId = next[0]?.id || "default";
				switchConfig(fallbackId);
			}
			return next;
		});
	}, [activeConfigId, setConfigs, switchConfig]);

	const renameConfig = useCallback((id: string, name: string) => {
		setConfigs(prev => prev.map(c => c.id === id ? { ...c, name, lastModified: Date.now() } : c));
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
