import type { TConfigEntry } from "../types/config";
import { use } from "react";
import {
	ConfigActionsContext,
	ConfigsContext,
	CurrentConfigIdContext,
	type IConfigActionsContext,
} from "../context/ConfigContext";

export const useCurrentConfigId: () => string = () => {
	const context = use(CurrentConfigIdContext);
	if (context === null) throw new Error("useCurrentConfigId must be used within ConfigProvider");
	return context;
};

export const useConfigs: () => TConfigEntry[] = () => {
	const context = use(ConfigsContext);
	if (context === null) throw new Error("useConfigs must be used within ConfigProvider");
	return context;
};

export const useConfigActions: () => IConfigActionsContext = () => {
	const context = use(ConfigActionsContext);
	if (context === null) throw new Error("useConfigActions must be used within ConfigProvider");
	return context;
};
