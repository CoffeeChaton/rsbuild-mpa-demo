// src/pages/game2/types/rowResult.ts

import type { IItem } from "./item";

/**
 * 計算後的 Row
 */
export interface IRowResult extends IItem {
  costMoney: number;
  costBooks: number;
  cumMoney: number;
  cumBooks: number;
  status: "safe" | "danger" | "disabled";
}
