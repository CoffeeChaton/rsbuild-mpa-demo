import React from "react";
import { Box, Flex, Grid } from "@radix-ui/themes";

import { InventoryCard } from "../components/InventoryCard";
import { TableArea } from "../components/TableArea";
import { Toolbar } from "../features/Toolbar";

import { useArsenalCalculator } from "../hooks/useArsenalCalculator";
import { NAV_BAR_HEIGHT } from "../config/constants";

/**
 * ArsenalLayout
 *
 * 負責：
 * - Page Layout
 * - 組合 UI
 *
 * 不寫業務邏輯
 */

export const ArsenalLayout: React.FC = () => {
  const {
    items,
    setItems,
    inventory,
    setInventory,
    rows,
    handleImport,
    handleExport,
  } = useArsenalCalculator();

  return (
    <Box
      p="4"
      style={{
        height: `calc(100vh - ${NAV_BAR_HEIGHT}px)`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--gray-2)",
      }}
    >
      <Toolbar
        onImport={handleImport}
        onExport={handleExport}
      />

      <Grid
        columns={{ initial: "1", lg: "280px 1fr" }}
        gap="4"
        style={{ flex: 1, overflow: "hidden" }}
      >
        {/* 左側卡片/上面卡片 */}
        <InventoryCard
          inventory={inventory}
          onUpdate={(field, val) => setInventory(p => ({ ...p, [field]: val }))}
        />

        {/* 主要表格 */}
        <Flex direction="column" gap="3" style={{ overflow: "hidden" }}>
          <TableArea
            rows={rows}
            items={items}
            setItems={setItems}
          />
        </Flex>
      </Grid>
    </Box>
  );
};
