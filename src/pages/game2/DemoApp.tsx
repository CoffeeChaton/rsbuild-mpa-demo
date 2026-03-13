import React from "react";
import { ArsenalLayout } from "./layout/ArsenalLayout";

/**
 * ============================================================
 * AI HANDOVER PROTOCOL / I/O SPECIFICATION
 * ============================================================
 * 【LAYOUT CONSTANTS】
 * - NAV_BAR_HEIGHT: 70px (頂部導航欄高度，用於計算視窗剩餘空間)
 * * 【I/O - TSV】
 * 格式：是否計算(O/X) | 稀有度 | 角色名 | 技能備註 | FROM模組 | TO模組 | FROM精英 | FROM等級 | TO精英 | TO等級
 * * 【PERSISTENCE】
 * Key: ark_arsenal_v6_final (保持一致，避免資料遺失)
 * ============================================================
 */

export const ArsenalCalculator: React.FC = () => {
  return <ArsenalLayout />;
};
