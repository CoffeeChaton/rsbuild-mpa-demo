/** * 1. 唯一的配置來源
 */
export const BOOK_CONFIG = [
	{ key: "advanced", label: "高級作戰紀錄", value: 2000 },
	{ key: "intermediate", label: "中級作戰紀錄", value: 1000 },
	{ key: "primary", label: "初級作戰紀錄", value: 400 },
	{ key: "basic", label: "基礎作戰紀錄", value: 200 },
] as const;

/** * 2. 類型體操：從配置自動推導 Key 的聯集
 * TBookKey = "advanced" | "intermediate" | "primary" | "basic"
 */
export type TBookKey = (typeof BOOK_CONFIG)[number]["key"];

/** * 3. 具名物件結構：強制要求包含配置中的所有 Key
 * 這樣萬一 CONFIG 刪了或改了名，這裡會自動同步或提示錯誤
 */
export type IBookStacks = Record<TBookKey, number>;

/** 初始狀態：使用 Record 確保所有 Key 都被初始化 */
export const DEFAULT_BOOK_STACKS: IBookStacks = {
	advanced: 0,
	intermediate: 0,
	primary: 0,
	basic: 0,
};

/** * 4. 計算總經驗值
 * 移除對 BOOK_MAP 的依賴，直接遍歷 BOOK_CONFIG
 */
export const calculateBookStacksValue = (stacks: IBookStacks): number => {
	return BOOK_CONFIG.reduce((acc, conf) => {
		// 使用 conf.key 動態存取，TS 已經知道 stacks[conf.key] 是 number
		return acc + (Number(stacks[conf.key]) || 0) * conf.value;
	}, 0);
};

/** * 5. 數據清洗
 * 利用 BOOK_CONFIG 動態生成物件，避免硬編碼
 */
export const sanitizeBookStacks = (stacks?: Partial<IBookStacks>): IBookStacks => {
	// 建立一個空物件並斷言為 IBookStacks
	const result = {} as IBookStacks;

	BOOK_CONFIG.forEach(conf => {
		result[conf.key] = Number(stacks?.[conf.key]) || 0;
	});

	return result;
};
