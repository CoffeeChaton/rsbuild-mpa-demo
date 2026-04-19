import type { IItem, IItemError, TFieldError } from "../types/item";
import { validateLevel } from "./validateItem";

const num = (v: string): number => parseInt(v, 10) || 0;

/**
 * 檢查培養進度是否合理 (To >= From)
 */
const checkProgress = (item: Pick<IItem, "e1" | "l1" | "e2" | "l2">): boolean => {
	const p1 = num(item.e1) * 100 + num(item.l1);
	const p2 = num(item.e2) * 100 + num(item.l2);
	return p2 >= p1;
};

export const ITEM_ERR_MSG = {
	INVALID_E_FROM: "初始精英階段錯誤",
	INVALID_L_FROM: "初始等級超出上限",
	INVALID_E_TO: "目標精英階段錯誤",
	INVALID_L_TO: "目標等級超出上限",
	MODULE_NOT_SUPPORTED: "3星以下無模組",
	MODULE_RANGE: "應在範圍 0~3",
	MODULE_LOW_TARGET: "目標不可低於初始",
	PROGRESS_BACKWARD: "目標不可低於初始進度",
} as const;

/**
 * 核心驗證函數
 */
export const validateItem = (item: IItem): IItemError => {
	const fields: IItemError["fields"] = {};
	const messages: string[] = [];

	const addErr = (fieldKey: TFieldError, msg: string): void => {
		// 如果該欄位還沒記錄過錯誤，則記錄之（優先顯示第一個錯誤）
		if (!fields[fieldKey]) {
			fields[fieldKey] = msg;
			messages.push(msg);
		}
	};

	const { rarity: r, e1, l1, e2, l2, moduleFrom: mf, moduleTo: mt } = item;
	const mF = num(mf);
	const mT = num(mt);

	// 1. 模組驗證
	if (r < 4) {
		if (mF !== 0) addErr("moduleFrom", ITEM_ERR_MSG.MODULE_NOT_SUPPORTED);
		if (mT !== 0) addErr("moduleTo", ITEM_ERR_MSG.MODULE_NOT_SUPPORTED);
	} else {
		if (mF < 0 || mF > 3) addErr("moduleFrom", `初始模組 ${ITEM_ERR_MSG.MODULE_RANGE}`);
		if (mT < 0 || mT > 3) addErr("moduleTo", `目標模組 ${ITEM_ERR_MSG.MODULE_RANGE}`);
		if (mF > mT) addErr("moduleTo", `目標模組${ITEM_ERR_MSG.MODULE_LOW_TARGET}`);
	}

	// 2. 等級上限驗證
	if (!validateLevel(r, e1, "1")) addErr("e1", ITEM_ERR_MSG.INVALID_E_FROM);
	if (!validateLevel(r, e1, l1)) addErr("l1", ITEM_ERR_MSG.INVALID_L_FROM);
	if (!validateLevel(r, e2, "1")) addErr("e2", ITEM_ERR_MSG.INVALID_E_TO);
	if (!validateLevel(r, e2, l2)) addErr("l2", ITEM_ERR_MSG.INVALID_L_TO);

	// 3. 進度倒退驗證
	if (!checkProgress(item)) {
		addErr("e2", ITEM_ERR_MSG.PROGRESS_BACKWARD);
		fields.l2 = ITEM_ERR_MSG.PROGRESS_BACKWARD;
		fields.progress = ITEM_ERR_MSG.PROGRESS_BACKWARD;
	}

	return { messages, fields };
};
