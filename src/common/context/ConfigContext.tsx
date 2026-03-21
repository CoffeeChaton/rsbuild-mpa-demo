import { type Context, createContext } from "react";
import type { IConfigEntry, TTheme } from "../types/config";

export interface IConfigActionsContext {
	/** 切換當前標籤頁使用的帳號配置 */
	switchConfig: (id: string) => void;
	/** 新增一個全域帳號配置 */
	addConfig: (name: string) => void;
	/** 刪除一個全域帳號配置 */
	deleteConfig: (id: string) => void;
	/** 重新命名特定帳號配置 */
	renameConfig: (id: string, name: string) => void;
	/** 更新特定帳號配置的主題顏色 */
	updateTheme: (id: string, theme: TTheme) => void;
	/**
	 * 切換「全域資料保險箱」鎖定狀態。
	 *
	 * 🔒 鎖定時的精確行為：
	 * 1. 同步性：狀態儲存於 localStorage，一旦開啟，所有標籤頁對該帳號的鎖定狀態會同步。
	 * 2. 寫入攔截：所有視窗（包括主動鎖定的視窗）均被禁止修改該帳號的 Items 或 Inventory。
	 * 3. UI 反饋：嘗試修改時會彈出紅色錯誤 Toast 指示處於全域鎖定模式。
	 * 4. 視窗連動：鎖定期間，該視窗會忽略來自其他標籤頁的帳號切換廣播。
	 * 5. 安全同步：若在鎖定期間檢測到背景資料變動，視窗會發出警告但「拒絕」自動刷新畫面，以保護當前視圖。
	 */
	toggleLock: () => void;
}

export const CurrentConfigIdContext: Context<string | null> = createContext<string | null>(null);
export const ConfigsContext: Context<IConfigEntry[] | null> = createContext<IConfigEntry[] | null>(null);
export const CurrentThemeContext: Context<TTheme | null> = createContext<TTheme | null>(null);
export const ConfigActionsContext: Context<IConfigActionsContext | null> = createContext<IConfigActionsContext | null>(null);
export const IsConfigLockedContext: Context<boolean> = createContext<boolean>(false);
