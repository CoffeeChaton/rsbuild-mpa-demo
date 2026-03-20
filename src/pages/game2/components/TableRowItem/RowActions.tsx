import React from "react";
import { Flex, IconButton } from "@radix-ui/themes";
import {
	TrashIcon,
} from "@radix-ui/react-icons";

interface IRowActionsProps {
	itemId: string;
	onDelete: (id: string) => void;
}

export const RowActions: React.FC<IRowActionsProps> = ({
	itemId,
	onDelete,
}) => {
	return (
		<Flex gap="1" justify="center">
			<IconButton size="1" variant="ghost" color="red" onClick={() => onDelete(itemId)} className="cursor-pointer">
				<TrashIcon />
			</IconButton>
		</Flex>
	);
};
