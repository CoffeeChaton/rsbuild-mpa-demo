// src/pages/game2/components/InventoryCard.tsx

import React from "react";
import { Box, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import type { IInventory } from "../types";

interface IInventoryCardProps {
  inventory: IInventory;
  onUpdate: (field: keyof IInventory, value: number) => void;
}

export const InventoryCard: React.FC<IInventoryCardProps> = ({ inventory, onUpdate }) => {
  return (
    <Card size="3">
      <Flex direction="column" gap="4">
        <Text weight="bold" size="3">
          <InfoCircledIcon /> 物資庫存
        </Text>
        <Box>
          <Text size="1" color="gray" mb="1" as="div">現有龍門幣 (LMD)</Text>
          <TextField.Root
            type="number"
            value={inventory.money}
            onChange={e => onUpdate("money", Number(e.target.value))}
          />
        </Box>
        <Box>
          <Text size="1" color="gray" mb="1" as="div">現有作戰記錄 (EXP)</Text>
          <TextField.Root
            type="number"
            value={inventory.books}
            onChange={e => onUpdate("books", Number(e.target.value))}
          />
        </Box>
      </Flex>
    </Card>
  );
};
