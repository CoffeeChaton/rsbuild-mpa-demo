// src/pages/game2/config/constants.ts

import type { IItem } from "../types/item";

/**
 * ============================================================
 * Arsenal Calculator Configuration
 * ============================================================
 *
 * 集中管理：
 * - 遊戲成本參數
 * - TSV 格式
 * - UI layout 常數
 * - default item
 *
 * 讓整個專案沒有魔術數字
 */

/**
 * Default item template
 *
 * 新增角色時使用
 */
export const DEFAULT_ITEM_TEMPLATE: Omit<IItem, "id"> = {
	calculate: true,
	rarity: 6,

	name: "",
	note: "",

	moduleFrom: "0",
	moduleTo: "3",

	e1: "0",
	l1: "1",

	e2: "2",
	l2: "1",
};

export const STORAGE_KEY = "ark_arsenal_v6_final";
