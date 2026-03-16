// src/pages/game2/context/ConfigContext.tsx
import React, { createContext } from "react";
import type { IConfigEntry } from "../types/config";

export interface IConfigContext {
	currentConfigId: string;
	configs: IConfigEntry[];
	switchConfig: (id: string) => void;
	addConfig: (name: string) => void;
	deleteConfig: (id: string) => void;
	renameConfig: (id: string, name: string) => void;
}

export const ConfigContext: React.Context<IConfigContext | null> = createContext<IConfigContext | null>(null);
