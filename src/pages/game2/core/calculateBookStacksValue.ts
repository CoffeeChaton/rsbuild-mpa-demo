import { BOOK_CONFIG, type IBookStacks } from "../config/inventory";

/**
 * 計算總經驗值 (純函數)
 */
export const calculateBookStacksValue = (stacks: IBookStacks): number => {
	let total = 0;
	// 使用 for...of 在處理固定長度陣列時效能略高於 reduce
	for (const conf of BOOK_CONFIG) {
		const amount = stacks[conf.key] ?? 0;
		total += amount * conf.value;
	}
	return total;
};

/**
 * 利用 BOOK_CONFIG 動態生成物件，避免硬編碼
 */
export const sanitizeBookStacks = (stacks?: Partial<IBookStacks>): IBookStacks => {
	const result = {} as IBookStacks;

	BOOK_CONFIG.forEach(conf => {
		result[conf.key] = stacks?.[conf.key] || 0;
	});
	return result;
};
