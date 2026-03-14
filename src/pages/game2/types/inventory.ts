// src/pages/game2/types/inventory.ts

/**
 * 不同等級的作戰記錄冊
 */
export type BookTier = "advanced" | "intermediate" | "primary" | "basic";

export interface IBookStacks {
  advanced: number;
  intermediate: number;
  primary: number;
  basic: number;
}

export const DEFAULT_BOOK_STACKS: IBookStacks = {
  advanced: 0,
  intermediate: 0,
  primary: 0,
  basic: 0,
};

export const BOOK_TIER_META = {
  advanced: {
    label: "高級作戰紀錄",
    value: 2000,
  },
  intermediate: {
    label: "中級作戰紀錄",
    value: 1000,
  },
  primary: {
    label: "初級作戰紀錄",
    value: 400,
  },
  basic: {
    label: "基礎作戰紀錄",
    value: 200,
  },
} satisfies Record<BookTier, { label: string, value: number }>;

export type BookTierMeta = typeof BOOK_TIER_META;
export const BOOK_TIER_ORDER: BookTier[] = ["advanced", "intermediate", "primary", "basic"];

export const calculateBookStacksValue = (stacks: IBookStacks): number =>
  BOOK_TIER_ORDER.reduce((acc, tier) => {
    const count = Number(stacks?.[tier]) || 0;
    return acc + count * BOOK_TIER_META[tier].value;
  }, 0);

export const sanitizeBookStacks = (stacks?: Partial<IBookStacks>): IBookStacks => ({
  advanced: Number.isFinite(Number(stacks?.advanced)) ? Number(stacks?.advanced) : 0,
  intermediate: Number.isFinite(Number(stacks?.intermediate)) ? Number(stacks?.intermediate) : 0,
  primary: Number.isFinite(Number(stacks?.primary)) ? Number(stacks?.primary) : 0,
  basic: Number.isFinite(Number(stacks?.basic)) ? Number(stacks?.basic) : 0,
});

/**
 * 玩家目前擁有資源
 */
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
}
