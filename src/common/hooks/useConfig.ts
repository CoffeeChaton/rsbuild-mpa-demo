import { useContext } from "react";
import {
	ConfigActionsContext,
	ConfigsContext,
	CurrentConfigIdContext,
	CurrentThemeContext,
	type IConfigActionsContext,
} from "../context/ConfigContext";
import type { IConfigEntry, TTheme } from "../types/config";

export const useCurrentConfigId: () => string = () => {
	const context = useContext(CurrentConfigIdContext);
	if (context === null) throw new Error("useCurrentConfigId must be used within ConfigProvider");
	return context;
};

export const useConfigs: () => IConfigEntry[] = () => {
	const context = useContext(ConfigsContext);
	if (context === null) throw new Error("useConfigs must be used within ConfigProvider");
	return context;
};

export const useCurrentTheme: () => TTheme = () => {
	const context = useContext(CurrentThemeContext);
	if (context === null) throw new Error("useCurrentTheme must be used within ConfigProvider");
	return context;
};

export const useConfigActions: () => IConfigActionsContext = () => {
	const context = useContext(ConfigActionsContext);
	if (context === null) throw new Error("useConfigActions must be used within ConfigProvider");
	return context;
};

export type TUseConfig = () => {
	switchConfig: (id: string) => void,
	addConfig: (name: string) => void,
	deleteConfig: (id: string) => void,
	renameConfig: (id: string, name: string) => void,
	updateTheme: (id: string, theme: TTheme) => void,
	currentConfigId: string,
	configs: IConfigEntry[],
	currentTheme: TTheme,
};

/**
 * @deprecated Use specific hooks instead for better performance
 */
export const useConfig: TUseConfig = () => {
	const currentConfigId = useCurrentConfigId();
	const configs = useConfigs();
	const actions = useConfigActions();
	const currentTheme = useCurrentTheme();

	return {
		currentConfigId,
		configs,
		currentTheme,
		...actions,
	};
};
