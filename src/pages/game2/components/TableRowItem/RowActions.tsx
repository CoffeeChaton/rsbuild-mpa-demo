import React from "react";
import { Flex, IconButton } from "@radix-ui/themes";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

interface IRowActionsProps {
  index: number;
  isLast: boolean;
  itemId: string;
  onMove: (idx: number, delta: number) => void;
  onDelete: (id: string) => void;
}

export const RowActions: React.FC<IRowActionsProps> = ({
  index,
  isLast,
  itemId,
  onMove,
  onDelete,
}) => {
  return (
    <Flex gap="1" justify="end">
      <IconButton size="1" variant="ghost" disabled={index === 0} onClick={() => onMove(index, -1)}>
        <ArrowUpIcon />
      </IconButton>

      <IconButton size="1" variant="ghost" disabled={isLast} onClick={() => onMove(index, 1)}>
        <ArrowDownIcon />
      </IconButton>

      <IconButton size="1" variant="ghost" color="red" onClick={() => onDelete(itemId)}>
        <TrashIcon />
      </IconButton>
    </Flex>
  );
};
