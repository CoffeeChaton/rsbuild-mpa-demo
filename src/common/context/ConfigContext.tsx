import { type Context, createContext } from "react";
import type { IConfigEntry, TTheme } from "../types/config";

export interface IConfigActionsContext {
	switchConfig: (id: string) => void;
	addConfig: (name: string) => void;
	deleteConfig: (id: string) => void;
	renameConfig: (id: string, name: string) => void;
	updateTheme: (id: string, theme: TTheme) => void;
}

export const CurrentConfigIdContext: Context<string | null> = createContext<string | null>(null);
export const ConfigsContext: Context<IConfigEntry[] | null> = createContext<IConfigEntry[] | null>(null);
export const CurrentThemeContext: Context<TTheme | null> = createContext<TTheme | null>(null);
export const ConfigActionsContext: Context<IConfigActionsContext | null> = createContext<IConfigActionsContext | null>(null);
