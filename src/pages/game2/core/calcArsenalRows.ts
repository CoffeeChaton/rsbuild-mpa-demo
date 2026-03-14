// src/pages/game2/core/calcArsenalRows.ts

import { calculateArknightsLevel } from "./calculateArknightsLevel";
import type { ILevelData } from "./data";
import type { IInventory, IItem, IRowResult } from "../types";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const parseNumber = (value: string | number | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const calcArsenalRows = (
  items: IItem[],
  inventory: IInventory,
  levelData: ILevelData,
): IRowResult[] => {
  let accMoney = 0;
  let accBooks = 0;

  return items.map((item) => {
    const rarity = clamp(parseNumber(item.rarity, 1), 1, 6);
    const currentElite = clamp(parseNumber(item.e1, 0), 0, 2);
    const currentLevel = clamp(parseNumber(item.l1, 1), 1, 90);
    let targetElite = clamp(parseNumber(item.e2, currentElite), currentElite, 2);
    let targetLevel = clamp(parseNumber(item.l2, currentLevel), 1, 90);

    if (targetElite === currentElite && targetLevel < currentLevel) {
      targetLevel = currentLevel;
    }

    if (targetElite < currentElite) {
      targetElite = currentElite;
      targetLevel = currentLevel;
    }

    const { expNeed, lmdNeed } = calculateArknightsLevel({
      star: rarity,
      current: {
        elite: currentElite,
        level: currentLevel,
      },
      target: {
        elite: targetElite,
        level: targetLevel,
      },
    }, levelData);

    const costMoney = lmdNeed;
    const costBooks = expNeed;

    let cumMoney = accMoney;
    let cumBooks = accBooks;

    if (item.calculate) {
      accMoney += costMoney;
      accBooks += costBooks;
      cumMoney = accMoney;
      cumBooks = accBooks;
    }

    const moneyStatus: IRowResult["status"] = !item.calculate
      ? "disabled"
      : (inventory.money >= cumMoney ? "safe" : "danger");
    const booksStatus: IRowResult["status"] = !item.calculate
      ? "disabled"
      : (inventory.books >= cumBooks ? "safe" : "danger");
    const status: IRowResult["status"] = !item.calculate
      ? "disabled"
      : (moneyStatus === "danger" || booksStatus === "danger" ? "danger" : "safe");

    return {
      ...item,
      costMoney,
      costBooks,
      cumMoney,
      cumBooks,
      moneyStatus,
      booksStatus,
      status,
    };
  });
};
