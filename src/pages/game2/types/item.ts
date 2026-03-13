// src/pages/game2/types/item.ts

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
  e1: number;
  l1: number;

  /**
   * TO 等級
   */
  e2: number;
  l2: number;
}
