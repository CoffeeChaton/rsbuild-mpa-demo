import { createContext } from "react";
import type { IConfigEntry, TTheme } from "../types/config";

export interface IConfigActionsContext {
	switchConfig: (id: string) => void;
	addConfig: (name: string) => void;
	deleteConfig: (id: string) => void;
	renameConfig: (id: string, name: string) => void;
	updateTheme: (id: string, theme: TTheme) => void;
}

export const CurrentConfigIdContext = createContext<string | null>(null);
export const ConfigsContext = createContext<IConfigEntry[] | null>(null);
export const CurrentThemeContext = createContext<TTheme | null>(null);
export const ConfigActionsContext = createContext<IConfigActionsContext | null>(null);
