import { useContext } from "react";
import {
	ConfigActionsContext,
	ConfigsContext,
	CurrentConfigIdContext,
	type IConfigActionsContext,
} from "../context/ConfigContext";
import type { TConfigEntry } from "../types/config";

export const useCurrentConfigId: () => string = () => {
	const context = useContext(CurrentConfigIdContext);
	if (context === null) throw new Error("useCurrentConfigId must be used within ConfigProvider");
	return context;
};

export const useConfigs: () => TConfigEntry[] = () => {
	const context = useContext(ConfigsContext);
	if (context === null) throw new Error("useConfigs must be used within ConfigProvider");
	return context;
};

export const useConfigActions: () => IConfigActionsContext = () => {
	const context = useContext(ConfigActionsContext);
	if (context === null) throw new Error("useConfigActions must be used within ConfigProvider");
	return context;
};
