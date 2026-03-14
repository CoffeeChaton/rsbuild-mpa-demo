// src/pages/game2/components/InventoryCard.tsx

import React from "react";
import { Card, Flex, Grid, Text, TextField, Tooltip } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  BOOK_TIER_META,
  BOOK_TIER_ORDER,
  type BookTier,
  calculateBookStacksValue,
  DEFAULT_BOOK_STACKS,
  type IInventory,
} from "../types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";

interface IInventoryCardProps {
  inventory: IInventory;
  onUpdate: (update: Partial<IInventory>) => void;
}

const clampPositiveInt = (value: string) => {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
};

const clampPositiveNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
};

export const InventoryCard: React.FC<IInventoryCardProps> = ({
  inventory,
  onUpdate,
}) => {
  const bookStacks = inventory.bookStacks ?? DEFAULT_BOOK_STACKS;

  const calculatedTotal = calculateBookStacksValue(bookStacks);
  const totalExpValue = calculatedTotal || inventory.books || 0;

  const handleStackChange = (tier: BookTier, value: string) => {
    const nextCount = clampPositiveInt(value);
    const nextStacks = { ...bookStacks, [tier]: nextCount };
    const nextTotal = calculateBookStacksValue(nextStacks);

    onUpdate({ bookStacks: nextStacks, books: nextTotal });
  };

  return (
    <Card size="2" className="flex h-full flex-col">
      <Flex direction="column" gap="4" className="flex-1">
        {/* Title */}
        <Flex align="center" gap="2">
          <InfoCircledIcon />
          <Text size="4" weight="bold">物資庫存</Text>
        </Flex>

        {/* LMD */}
        <Grid columns="150px 1fr" gap="3" align="center">
          <Text size="2" color="gray" weight="bold">龍門幣 (LMD)</Text>
          <TextField.Root
            placeholder="輸入金額"
            size="2"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={inventory.money}
            onChange={(e) => onUpdate({ money: clampPositiveNumber(e.target.value) })}
            className="tabular-nums"
          />
        </Grid>

        {/* EXP Accordion */}
        <Accordion type="multiple">
          <AccordionItem value="exp">
            <AccordionTrigger>
              <Text size="2" color="gray" weight="bold">
                {"EXP 總計 "}
                <Text color="blue">
                  {totalExpValue.toLocaleString()}
                </Text>
              </Text>
            </AccordionTrigger>

            <AccordionContent>
              <Grid columns="150px 1fr" gap="3" align="center">
                {BOOK_TIER_ORDER.map((tier) => {
                  const meta = BOOK_TIER_META[tier];

                  return (
                    <React.Fragment key={tier}>
                      <Tooltip
                        content={`${meta.label}：每份 ${meta.value.toLocaleString()} EXP`}
                      >
                        <Text size="2" weight="bold" color="gray">
                          * {meta.label}
                        </Text>
                      </Tooltip>

                      <TextField.Root
                        placeholder="數量"
                        size="2"
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        value={bookStacks[tier] ?? 0}
                        onChange={(e) => handleStackChange(tier, e.target.value)}
                        className="tabular-nums"
                      />
                    </React.Fragment>
                  );
                })}
              </Grid>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Card>
  );
};
