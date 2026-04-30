import type { TConfigEntry } from "../types/config";
import { use } from "react";
import {
	ConfigActionsContext,
	ConfigsContext,
	CurrentConfigIdContext,
	type IConfigActionsContext,
} from "../context/ConfigContext";

function useRequiredContext<T>(context: React.Context<T | null>, name: string): T {
	const val = use(context);
	if (val === null) throw new Error(`${name} must be used within ConfigProvider`);
	return val;
}

export const useCurrentConfigId = (): string => useRequiredContext(CurrentConfigIdContext, "useCurrentConfigId");
export const useConfigs = (): TConfigEntry[] => useRequiredContext(ConfigsContext, "useConfigs");
export const useConfigActions = (): IConfigActionsContext => useRequiredContext(ConfigActionsContext, "useConfigActions");
