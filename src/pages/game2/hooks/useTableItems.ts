// src/pages/game2/hooks/useTableItems.ts

import { DEFAULT_ITEM_TEMPLATE } from "../config/constants";
import type { IItem } from "../types";
/**
 * useTableItems
 *
 * 專門處理 Table rows 的 CRUD 操作
 *
 * 責任：
 * - update row
 * - delete row
 * - move row
 * - create row
 *
 * 讓 UI 不需要寫 setItems(prev => ...)
 */

export const useTableItems = (
  items: IItem[],
  setItems: React.Dispatch<React.SetStateAction<IItem[]>>,
) => {
  /**
   * 更新欄位
   */
  const updateItem = (
    id: string,
    field: keyof IItem,
    value: unknown,
  ) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  /**
   * 刪除行
   */
  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  /**
   * 新增行
   */
  const createItem = () => {
    setItems(prev => [
      ...prev,
      {
        ...DEFAULT_ITEM_TEMPLATE,
        id: crypto.randomUUID(),
      },
    ]);
  };

  /**
   * 上下移動
   */
  const moveItem = (
    idx: number,
    delta: number,
  ) => {
    const next = idx + delta;
    if (next < 0 || next >= items.length) return;
    const list = [...items];
    [list[idx], list[next]] = [list[next], list[idx]];
    setItems(list);
  };

  return {
    updateItem,
    deleteItem,
    createItem,
    moveItem,
  };
};
