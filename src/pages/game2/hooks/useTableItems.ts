// src/pages/game2/hooks/useTableItems.ts

import { useCallback, useMemo } from "react";
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
  setItems: React.Dispatch<React.SetStateAction<IItem[]>>,
) => {
  /**
   * 更新欄位
   */
  const updateItem = useCallback((
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
  }, [setItems]);

  /**
   * 刪除行
   */
  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, [setItems]);

  /**
   * 新增行
   */
  const createItem = useCallback(() => {
    setItems(prev => [
      ...prev,
      {
        ...DEFAULT_ITEM_TEMPLATE,
        id: crypto.randomUUID(),
      },
    ]);
  }, [setItems]);

  /**
   * 上下移動
   */
  const moveItem = useCallback((
    idx: number,
    delta: number,
  ) => {
    const target = idx + delta;
    setItems(prev => {
      if (target < 0 || target >= prev.length) return prev;
      const list = [...prev];
      [list[idx], list[target]] = [list[target], list[idx]];
      return list;
    });
  }, [setItems]);

  return useMemo(() => ({
    updateItem,
    deleteItem,
    createItem,
    moveItem,
  }), [updateItem, deleteItem, createItem, moveItem]);
};
