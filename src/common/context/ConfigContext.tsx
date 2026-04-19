import { type Context, createContext } from "react";
import type { TConfigEntry } from "../types/config";

export interface IConfigActionsContext {
	/** 切換當前標籤頁使用的配置 */
	switchConfig: (id: string) => void;
	/** 新增一個配置 */
	addConfig: (name: string) => void;
	/** 刪除一個配置 */
	deleteConfig: (id: string) => void;
	/** 重新命名特定配置 */
	renameConfig: (id: string, name: string) => void;
}

export const CurrentConfigIdContext: Context<string | null> = createContext<string | null>(null);
export const ConfigsContext: Context<TConfigEntry[] | null> = createContext<TConfigEntry[] | null>(null);
export const ConfigActionsContext: Context<IConfigActionsContext | null> = createContext<IConfigActionsContext | null>(null);
