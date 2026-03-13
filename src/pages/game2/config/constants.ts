// src/pages/game2/config/constants.ts

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
 * 每個等級差距對應的資源成本
 *
 * NOTE:
 * diff = (elite * 100 + level)
 */
export const COST_PER_LEVEL = {
  money: 4800,
  books: 3200,
};

/**
 * TSV Export Header
 *
 * Excel compatible
 */
export const TSV_HEADER = "是否計算\t星級\t角色名\t技能備註\tFROM\tTO\t精1\t等1\t精2\t等2\t預估錢\t預估書\t累計錢\t累計書";

/**
 * Default item template
 *
 * 新增角色時使用
 */
export const DEFAULT_ITEM_TEMPLATE = {
  calculate: true,

  name: "",
  note: "",

  moduleFrom: "0",
  moduleTo: "3",

  e1: 0,
  l1: 1,

  e2: 2,
  l2: 1,
  rarity: 6, // 預設稀有度
};

/**
 * TSV import 判斷 header
 */
export const TSV_HEADER_KEYWORDS = [
  "計算",
  "角色",
];

/** 預留導航欄高度常數 */
export const NAV_BAR_HEIGHT = 70;

export const STORAGE_KEY = "ark_arsenal_v6_final";
