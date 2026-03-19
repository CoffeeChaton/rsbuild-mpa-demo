"use client";

import * as React from "react";
import { ReaderIcon, StackIcon } from "@radix-ui/react-icons";
import {
	Box,
	Card,
	Flex,
	Separator,
	Text,
	TextField,
} from "@radix-ui/themes";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IBasicInfoPanelProps {}

export const BasicInfoPanel: React.FC<IBasicInfoPanelProps> = () => {
	const [lmd, setLmd] = React.useState("500000");
	const [expBooks, setExpBooks] = React.useState("0");
	const [lmdProduction, setLmdProduction] = React.useState("20000");
	const [expProduction, setExpProduction] = React.useState("10000");

	return (
		<Flex direction="column" gap="4" height="100%">
			<Separator size="4" />

			{/* Inventory Section */}
			<Flex direction="column" gap="3">
				<Flex align="center" gap="2">
					<StackIcon className="text-gray-500" />
					<Text size="1" weight="bold" color="gray" className="uppercase tracking-wider">
						庫存資源
					</Text>
				</Flex>
				<Card variant="surface" className="bg-gray-50/50 dark:bg-gray-900/50">
					<Flex direction="column" gap="3" p="1">
						<Box>
							<Text as="label" size="1" color="gray" mb="1">
								龍門幣
							</Text>
							<TextField.Root
								type="number"
								value={lmd}
								onChange={(e) => setLmd(e.target.value)}
								size="1"
								className="font-mono"
								variant="surface"
							/>
						</Box>
						<Box>
							<Text as="label" size="1" color="gray" mb="1">
								作戰記錄合計 (EXP)
							</Text>
							<TextField.Root
								type="number"
								value={expBooks}
								onChange={(e) => setExpBooks(e.target.value)}
								size="1"
								className="font-mono"
								variant="surface"
							>
								<TextField.Slot side="right">
									<Text size="1" color="gray" className="pr-1">EXP</Text>
								</TextField.Slot>
							</TextField.Root>
						</Box>
					</Flex>
				</Card>
			</Flex>

			<Separator size="4" />

			{/* Production Section */}
			<Flex direction="column" gap="3">
				<Flex align="center" gap="2">
					<ReaderIcon className="text-gray-500" />
					<Text size="1" weight="bold" color="gray" className="uppercase tracking-wider">
						每日產能
					</Text>
				</Flex>
				<Card variant="surface" className="bg-gray-50/50 dark:bg-gray-900/50">
					<Flex direction="column" gap="3" p="1">
						<Box>
							<Text as="label" size="1" color="gray" mb="1">
								龍門幣產出
							</Text>
							<TextField.Root
								type="number"
								value={lmdProduction}
								onChange={(e) => setLmdProduction(e.target.value)}
								size="1"
								className="font-mono"
								variant="surface"
							/>
						</Box>
						<Box>
							<Text as="label" size="1" color="gray" mb="1">
								經驗書產出
							</Text>
							<TextField.Root
								type="number"
								value={expProduction}
								onChange={(e) => setExpProduction(e.target.value)}
								size="1"
								className="font-mono"
								variant="surface"
							/>
						</Box>
					</Flex>
				</Card>
			</Flex>
		</Flex>
	);
};
