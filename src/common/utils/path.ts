// src/common/utils/path.ts

import type { TPageKey } from "../config/pages";

/**
 * 根據 PAGE_MAP 定義的 Key 獲取完整 Web 路徑
 * @param pageKey - 必須為 PAGE_MAP 中定義的鍵值 (例如: 'index', 'products', 'profile')
 * @returns 包含 ASSET_PREFIX 的格式化路徑
 */
export const getStaticPath = (pageKey: TPageKey): string => {
  const prefix = "/";

  // 針對根路徑 'index' 進行特殊處理
  const subPath = pageKey === "index" ? "" : pageKey;

  // 拼接路徑並過濾掉重複或結尾的斜槓
  // 範例：prefix='/repo/' + subPath='products' -> '/repo/products'
  const joined = `${prefix}${subPath}`.replace(/\/+$/, "");

  return joined || "/";
};
