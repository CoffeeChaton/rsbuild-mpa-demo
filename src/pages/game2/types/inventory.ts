// src/pages/game2/types/inventory.ts

/** * 經驗書配置：按 [高級, 中級, 初級, 基礎] 順序排列
 * 只存元數據，不存狀態
 */
export const BOOK_CONFIG = [
  { label: "高級作戰紀錄", value: 2000 },
  { label: "中級作戰紀錄", value: 1000 },
  { label: "初級作戰紀錄", value: 400 },
  { label: "基礎作戰紀錄", value: 200 },
] as const;

/** 經驗書數量狀態：固定長度為 4 的陣列 [count, count, count, count] */
export type IBookStacks = [number, number, number, number];

/** 初始狀態：全 0 */
export const DEFAULT_BOOK_STACKS: IBookStacks = [0, 0, 0, 0];

/** * 計算總經驗值
 * 直接用 index 對應 CONFIG 的 value
 */
export const calculateBookStacksValue = (stacks: IBookStacks): number => stacks.reduce((acc, count, i) => acc + (Number(count) || 0) * BOOK_CONFIG[i].value, 0);

/** 數據清洗：確保長度為 4 且皆為數字 */
export const sanitizeBookStacks = (stacks?: IBookStacks): IBookStacks => {
  const base = Array.isArray(stacks) ? stacks : DEFAULT_BOOK_STACKS;
  return BOOK_CONFIG.map((_, i) => {
    const val = Number(base[i]);
    return Number.isFinite(val) ? val : 0;
  }) as IBookStacks;
};

export interface IInventory {
  money: number;
  /**
   * 透過作戰記錄冊折算後的總經驗值
   */
  books: number;
  /**
   * 各等級作戰記錄冊的数量
   */
  bookStacks: IBookStacks;
  /**
   * 平均獲得龍門幣（例如日產）
   */
  avgMoneyProduction: number;
  /**
   * 平均獲得經驗書（折算 EXP）
   */
  avgBookProduction: number;
}
