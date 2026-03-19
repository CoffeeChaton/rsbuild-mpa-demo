import * as React from "react";
import { ExternalLinkIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Text } from "@radix-ui/themes";

export const AppFooter: React.FC = () => {
	return (
		<footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
			<Box px="4" py="3">
				<Flex direction={{ initial: "column", sm: "row" }} align="center" justify="between" gap="2">
					<Flex align="center" gap="4">
						<Text size="1" color="gray">
							明日方舟 練度規劃表
						</Text>
						<Box display={{ initial: "none", sm: "block" }}>
							<Text size="1" color="gray">|</Text>
						</Box>
						<Box display={{ initial: "none", sm: "block" }}>
							<Text size="1" color="gray">
								資料來源: MooncellWiki / ArknightsToolbox
							</Text>
						</Box>
					</Flex>
					<Flex align="center" gap="2">
						<Button variant="ghost" color="gray" size="1" asChild>
							<a
								href="https://github.com/CoffeeChaton/rsbuild-mpa-demo"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5"
							>
								<GitHubLogoIcon width="14" height="14" />
								GitHub
							</a>
						</Button>
						<Button variant="ghost" color="gray" size="1" asChild>
							<a
								href="https://prts.wiki"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5"
							>
								<ExternalLinkIcon width="14" height="14" />
								PRTS Wiki
							</a>
						</Button>
					</Flex>
				</Flex>
			</Box>
			<Box px="4" py="2" className="border-t border-gray-200/50 dark:border-gray-800/50 text-center">
				<Text size="1" color="gray" className="opacity-70" style={{ fontSize: "10px" }}>
					本項目所使用的遊戲資源版權屬於上海鷹角網絡科技有限公司
				</Text>
			</Box>
		</footer>
	);
};
