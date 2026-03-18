import { useContext } from "react";
import {
	ConfigActionsContext,
	ConfigsContext,
	CurrentConfigIdContext,
	CurrentThemeContext,
} from "../context/ConfigContext";

export const useCurrentConfigId = () => {
	const context = useContext(CurrentConfigIdContext);
	if (context === null) throw new Error("useCurrentConfigId must be used within ConfigProvider");
	return context;
};

export const useConfigs = () => {
	const context = useContext(ConfigsContext);
	if (context === null) throw new Error("useConfigs must be used within ConfigProvider");
	return context;
};

export const useCurrentTheme = () => {
	const context = useContext(CurrentThemeContext);
	if (context === null) throw new Error("useCurrentTheme must be used within ConfigProvider");
	return context;
};

export const useConfigActions = () => {
	const context = useContext(ConfigActionsContext);
	if (context === null) throw new Error("useConfigActions must be used within ConfigProvider");
	return context;
};

/**
 * @deprecated Use specific hooks instead for better performance
 */
export const useConfig = () => {
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
