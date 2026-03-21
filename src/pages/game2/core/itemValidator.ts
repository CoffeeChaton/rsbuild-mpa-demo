import type { IItem, IItemError, TFieldError } from "../types";
import { validateLevel } from "./validateItem";

const num = (v: string) => parseInt(v, 10) || 0;

/**
 * 檢查培養進度是否合理 (To >= From)
 */
export const checkProgress = (item: Pick<IItem, "e1" | "l1" | "e2" | "l2">): boolean => {
	const p1 = num(item.e1) * 100 + num(item.l1);
	const p2 = num(item.e2) * 100 + num(item.l2);
	return p2 >= p1;
};

/**
 * 核心驗證函數
 */
export const validateItem = (item: IItem): IItemError => {
	const f: IItemError["fields"] = {};
	const msgs: string[] = [];
	const { rarity: r, e1, l1, e2, l2, moduleFrom: mf, moduleTo: mt } = item;

	const addErr = (fieldKey: TFieldError, msg: string) => {
		f[fieldKey] = true;
		msgs.push(msg);
	};
	const mF = num(mf);
	const mT = num(mt);

	// 1. 模組驗證
	// 檢查該星級是否支援模組 (根據你的 matrix, 4-6星支援)
	const isModuleSupported = r >= 4;
	if (!isModuleSupported) {
		if (mF !== 0) addErr("moduleFrom", "3星以下無模組功能");
		if (mT !== 0) addErr("moduleTo", "3星以下無模組功能");
	} else {
		if (mF < 0 || mF > 3) addErr("moduleFrom", "初始模組等級 0~3");
		if (mT < 0 || mT > 3) addErr("moduleTo", "目標模組等級 0~3");
		if (mF > mT) {
			addErr("moduleTo", "模組目標不可低於初始");
			f.moduleRange = true;
		}
	}

	// 2. 等級上限驗證 (調用你之前的 validateLevel)
	if (!validateLevel(r, e1, "1")) addErr("e1", "初始精英階段錯誤");
	if (!validateLevel(r, e1, l1)) addErr("l1", "初始等級超出上限");
	if (!validateLevel(r, e2, "1")) addErr("e2", "目標精英階段錯誤");
	if (!validateLevel(r, e2, l2)) addErr("l2", "目標等級超出上限");

	// 3. 進度倒退驗證
	if (!checkProgress(item)) {
		addErr("e2", "目標進度不可低於初始");
		f.l2 = true;
		f.progress = true;
	}

	return { messages: msgs, fields: f };
};
