// src/pages/game2/hooks/useArsenalCalculator.ts

import { useEffect, useMemo, useState } from "react";
import { calcArsenalRows } from "../core/calcArsenalRows";
import {
  STORAGE_KEY,
  TSV_HEADER,
  TSV_HEADER_KEYWORDS,
} from "../config/constants";
import type { IInventory, IItem } from "../types";

export const DEFAULT_ITEM: Omit<IItem, "id"> = {
  calculate: true,
  name: "",
  note: "",
  moduleFrom: "0",
  moduleTo: "3",
  e1: 0,
  l1: 1,
  e2: 2,
  l2: 1,
};

export const useArsenalCalculator = () => {
  const [items, setItems] = useState<IItem[]>([]);
  const [inventory, setInventory] = useState<IInventory>({ money: 0, books: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { items: sItems, inv: sInv } = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (sItems) setItems(sItems);
        if (sInv) setInventory(sInv);
      } catch (e) {
        console.error("Restore failed", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, inv: inventory }));
  }, [items, inventory, isLoaded]);

  // --- 計算累計 ---
  const rows = useMemo(
    () => calcArsenalRows(items, inventory),
    [items, inventory],
  );

  // --- 導入 TSV ---
  const handleImport = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
      const dataLines = TSV_HEADER_KEYWORDS.some(k => lines[0].includes(k)) ? lines.slice(1) : lines;
      const newItems: IItem[] = dataLines.map(line => {
        const c = line.split("\t");
        return {
          id: crypto.randomUUID(),
          calculate: c[0]?.trim() === "O",
          rarity: Number(c[1]) || 5, // <- 新增
          name: c[2] || "",
          note: c[3] || "",
          moduleFrom: c[4] || "0",
          moduleTo: c[5] || "3",
          e1: Number(c[6]) || 0,
          l1: Number(c[7]) || 1,
          e2: Number(c[8]) || 0,
          l2: Number(c[9]) || 1,
        };
      });
      setItems(newItems);
    } catch (error) {
      console.error("貼上失敗", error);
      alert("貼上失敗");
    }
  };

  // --- 導出 TSV ---
  const handleExport = () => {
    const header = TSV_HEADER;
    const body = rows.map(r =>
      `${r.calculate ? "O" : "X"}\t${r.rarity}\t${r.name}\t${r.note}\t${r.moduleFrom}\t${r.moduleTo}\t${r.e1}\t${r.l1}\t${r.e2}\t${r.l2}\t${r.costMoney}\t${r.costBooks}\t${r.cumMoney}\t${r.cumBooks}`
    ).join("\n");
    navigator.clipboard.writeText(header + "\n" + body);
    alert("TSV 已複製到剪貼簿");
  };

  // --- 上下移動 ---
  const moveRow = (idx: number, delta: number) => {
    const next = idx + delta;
    if (next < 0 || next >= items.length) return;
    const list = [...items];
    [list[idx], list[next]] = [list[next], list[idx]];
    setItems(list);
  };

  return { items, setItems, inventory, setInventory, rows, handleImport, handleExport, moveRow };
};
