import * as React from "react";
import { Component2Icon } from "@radix-ui/react-icons";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";

export const AppHeader: React.FC = () => {
	return (
		<header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-backdrop-filter:bg-white/60">
			<Flex align="center" justify="between" height="56px" px="4">
				<Flex align="center" gap="3">
					<Box className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
						<Component2Icon width="18" height="18" />
					</Box>
					<Flex direction="column">
						<Heading as="h1" size="3" weight="bold" className="tracking-tight">
							練度規劃表
						</Heading>
						<Text size="1" color="gray" className="uppercase tracking-wider">
							Arknights Planner
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</header>
	);
};
