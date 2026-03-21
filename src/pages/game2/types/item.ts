// src/pages/game2/types/item.ts

export type TFieldError =
	| "moduleFrom"
	| "moduleTo"
	| "e1"
	| "l1"
	| "e2"
	| "l2"
	| "progress"
	| "moduleRange"
	| "name"
	| "note";

export interface IItemError {
	messages: string[];
	/** 鍵值為欄位名，值為該欄位的錯誤訊息字串 */
	fields: Partial<Record<TFieldError, string>>;
}

/**
 * 基本需求項目
 *
 * 對應一個角色的培養需求
 */
export interface IItem {
	id: string;

	/**
	 * 是否參與計算
	 */
	calculate: boolean;

	/** 稀有度 1~6 */
	rarity: number;

	/**
	 * 角色名稱
	 */
	name: string;

	/**
	 * 備註
	 */
	note: string;

	/**
	 * 模組等級
	 */
	moduleFrom: string;
	moduleTo: string;

	/**
	 * FROM 等級
	 */
	e1: string;
	l1: string;

	/**
	 * TO 等級
	 */
	e2: string;
	l2: string;

	/** 錯誤訊息 */
	error?: IItemError;
}
