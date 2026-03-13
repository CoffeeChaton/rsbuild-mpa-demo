/**
 * ============================================================
 * DATA MODELS & CONSTANTS
 * ============================================================
 */

export interface IItem {
  id: string;
  calculate: boolean;
  name: string;
  note: string;
  moduleFrom: string;
  moduleTo: string;
  e1: number;
  l1: number;
  e2: number;
  l2: number;
}

export interface IInventory {
  money: number;
  books: number;
}

// 計算後的行數據結構
export interface IRowResult extends IItem {
  costMoney: number;
  costBooks: number;
  cumMoney: number;
  cumBooks: number;
  status: "safe" | "danger" | "disabled";
}

export const STORAGE_KEY = "ark_arsenal_v6_final";

/** 預留導航欄高度常數 */
export const NAV_BAR_HEIGHT = 70;
