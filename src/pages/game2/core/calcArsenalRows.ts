// src/pages/game2/core/calcArsenalRows.ts

import { COST_PER_LEVEL } from "../config/constants";
import type { IInventory, IItem, IRowResult } from "../types";

/**
 * Arsenal Cost Engine
 *
 * 純函數計算：
 * - 每行消耗
 * - 累計消耗
 * - 狀態
 *
 * 不依賴 React
 * 不依賴 UI
 *
 * 可在：
 * - React
 * - Node
 * - CLI
 * - tests
 * - AI agents
 * 重用
 */

export const calcArsenalRows = (
  items: IItem[],
  inventory: IInventory,
): IRowResult[] => {
  let accMoney = 0;
  let accBooks = 0;

  return items.map((item) => {
    /**
     * 等級差計算
     *
     * e1=精英階
     * l1=等級
     *
     * 轉換成線性數字
     */
    const diff = (item.e2 * 100 + item.l2)
      - (item.e1 * 100 + item.l1);

    const costMoney = item.calculate && diff > 0
      ? diff * COST_PER_LEVEL.money
      : 0;

    const costBooks = item.calculate && diff > 0
      ? diff * COST_PER_LEVEL.books
      : 0;

    if (item.calculate) {
      accMoney += costMoney;
      accBooks += costBooks;
    }

    const isAffordable = inventory.money >= accMoney && inventory.books >= accBooks;

    return {
      ...item,
      costMoney,
      costBooks,
      cumMoney: accMoney,
      cumBooks: accBooks,
      status: !item.calculate
        ? "disabled"
        : isAffordable
        ? "safe"
        : "danger",
    };
  });
};
