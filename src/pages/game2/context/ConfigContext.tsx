// src/pages/game2/context/ConfigContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEY } from "../config/constants";

export interface IConfigEntry {
	id: string;
	name: string;
	lastModified: number;
}

interface IConfigContext {
	currentConfigId: string;
	configs: IConfigEntry[];
	switchConfig: (id: string) => void;
	addConfig: (name: string) => void;
	deleteConfig: (id: string) => void;
	renameConfig: (id: string, name: string) => void;
}

const CONFIG_LIST_KEY = `${STORAGE_KEY}_list`;

const ConfigContext = createContext<IConfigContext | null>(null);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [configs, setConfigs] = useState<IConfigEntry[]>(() => {
		const saved = localStorage.getItem(CONFIG_LIST_KEY);
		if (saved) {
			try {
				return JSON.parse(saved);
			} catch (e) {
				console.error("Failed to parse configs", e);
			}
		}
		// Initial default config if none exists
		return [{ id: "default", name: "預設存檔", lastModified: Date.now() }];
	});

	const [currentConfigId, setCurrentConfigId] = useState(() => {
		return localStorage.getItem(`${STORAGE_KEY}_current`) || "default";
	});

	useEffect(() => {
		localStorage.setItem(CONFIG_LIST_KEY, JSON.stringify(configs));
	}, [configs]);

	useEffect(() => {
		localStorage.setItem(`${STORAGE_KEY}_current`, currentConfigId);
	}, [currentConfigId]);

	const switchConfig = useCallback((id: string) => {
		setCurrentConfigId(id);
	}, []);

	const addConfig = useCallback((name: string) => {
		const newConfig: IConfigEntry = {
			id: `config_${Date.now()}`,
			name: name || `新存檔 ${configs.length + 1}`,
			lastModified: Date.now(),
		};
		setConfigs(prev => [...prev, newConfig]);
		setCurrentConfigId(newConfig.id);
	}, [configs.length]);

	const deleteConfig = useCallback((id: string) => {
		if (id === "default") return; // Keep at least one
		setConfigs(prev => {
			const next = prev.filter(c => c.id !== id);
			if (currentConfigId === id) {
				setCurrentConfigId(next[0]?.id || "default");
			}
			return next;
		});
		localStorage.removeItem(`${STORAGE_KEY}_data_${id}`);
	}, [currentConfigId]);

	const renameConfig = useCallback((id: string, name: string) => {
		setConfigs(prev => prev.map(c => c.id === id ? { ...c, name, lastModified: Date.now() } : c));
	}, []);

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

// eslint-disable-next-line react-refresh/only-export-components
export const useConfig: () => IConfigContext = () => {
	const context = useContext(ConfigContext);
	if (!context) throw new Error("useConfig must be used within ConfigProvider");
	return context;
};
