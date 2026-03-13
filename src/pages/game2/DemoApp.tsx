import React from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
} from "@radix-ui/themes";
import { ClipboardCopyIcon, DownloadIcon } from "@radix-ui/react-icons";
import { InventoryCard } from "./components/InventoryCard";
import { useArsenalCalculator } from "./hooks/useArsenalCalculator";
import { TableArea } from "./components/TableArea";
import { NAV_BAR_HEIGHT } from "./config/constants";

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
  const { items, setItems, inventory, setInventory, rows, handleImport, handleExport, moveRow } = useArsenalCalculator();

  return (
    <Box p="4" style={{ height: `calc(100vh - ${NAV_BAR_HEIGHT}px)`, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--gray-2)" }}>
      {/* Header */}
      <Flex justify="between" align="end" mb="4">
        <Heading size="7">Arsenal Calculator</Heading>
        <Flex gap="3">
          <Button variant="soft" onClick={handleImport}>
            <DownloadIcon /> 從剪貼簿導入
          </Button>
          <Button variant="solid" color="green" onClick={handleExport}>
            <ClipboardCopyIcon /> 導出 TSV
          </Button>
        </Flex>
      </Flex>

      <Grid columns={{ initial: "1", lg: "280px 1fr" }} gap="4" style={{ flex: 1, overflow: "hidden" }}>
        <InventoryCard
          inventory={inventory}
          onUpdate={(field, val) => setInventory(p => ({ ...p, [field]: val }))}
        />

        <Flex direction="column" gap="3" style={{ overflow: "hidden" }}>
          <TableArea
            rows={rows}
            items={items}
            setItems={setItems}
            onMove={moveRow}
          />
        </Flex>
      </Grid>
    </Box>
  );
};
