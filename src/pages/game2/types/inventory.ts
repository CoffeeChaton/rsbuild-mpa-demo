// src/pages/game2/types/inventory.ts

import type { IBookStacks } from "../config/inventory";

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
