// src/pages/game3/assets/planLoader.ts

// 這裡明確列出所有檔案，Rsbuild 就能 100% 確保它們被打包
export const DEFAULT_PLANS = {
  plan_a: () => import("./plan_a.tsv?raw"),
  plan_b: () => import("./plan_b.tsv?raw"),
  plan_c: () => import("./plan_c.tsv?raw"),
} as const;

export type TDefaultPlanKey = keyof typeof DEFAULT_PLANS;

// SWR 的 Fetcher：負責根據 Key 載入對應的靜態資源
export const tsvFetcher = async (key: TDefaultPlanKey) => {
  if (key in DEFAULT_PLANS) {
    const m = await DEFAULT_PLANS[key as TDefaultPlanKey]();
    return m.default as string;
  }
  return "";
};
