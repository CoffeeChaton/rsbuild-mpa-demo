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
export const TSV_HEADER = [
  ["", "", "", "", "模組", "", "初始練度", "", "", "", "自動估算"].join("\t"),
  ["是否計算", "星級", "角色名", "技能備註", "FROM", "TO", "精英化", "等級", "精英化", "等級", "預估錢", "預估書", "累計錢", "累計書"].join("\t"),
].join("\n");

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
export const NAV_BAR_HEIGHT = 100;

export const STORAGE_KEY = "ark_arsenal_v6_final";
