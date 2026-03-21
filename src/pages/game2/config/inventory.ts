/**
 * 1. 唯一的配置來源
 */
export const BOOK_CONFIG = [
	{ key: "advanced", label: "高級作戰紀錄", value: 2000 },
	{ key: "intermediate", label: "中級作戰紀錄", value: 1000 },
	{ key: "primary", label: "初級作戰紀錄", value: 400 },
	{ key: "basic", label: "基礎作戰紀錄", value: 200 },
] as const;

/**
 * 2. 類型體操：從配置自動推導 Key 的聯集
 * TBookKey = "advanced" | "intermediate" | "primary" | "basic"
 */
export type TBookKey = (typeof BOOK_CONFIG)[number]["key"];

/**
 * 3. 具名物件結構：強制要求包含配置中的所有 Key
 */
export type IBookStacks = Record<TBookKey, number>;

/** 初始狀態：使用 Record 確保所有 Key 都被初始化 */
export const DEFAULT_BOOK_STACKS: IBookStacks = {
	advanced: 0,
	intermediate: 0,
	primary: 0,
	basic: 0,
};
