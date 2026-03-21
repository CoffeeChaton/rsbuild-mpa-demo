import * as React from "react";
import { memo } from "react";
import { ExternalLinkIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Flex, Separator, Text } from "@radix-ui/themes";
import { IconLink } from "@/src/common/components/IconLink";

/**
 * AppFooter
 *
 * 靜態頁尾組件。
 * 使用 memo 避免不必要的重新渲染。
 */
export const AppFooter: React.FC = memo(() => {
	const sources = [
		{
			label: "arkntools",
			href: "https://github.com/arkntools/arknights-toolbox-data/blob/main/assets/data/level.json",
			icon: <GitHubLogoIcon width="13" height="13" />,
		},
		{
			label: "PRTS Wiki",
			href: "https://prts.wiki/w/干员升级数值",
			icon: <ExternalLinkIcon width="13" height="13" />,
		},
	];

	return (
		<footer
			style={{
				backgroundColor: "var(--slate-1)",
				borderTop: "1px solid var(--slate-4)",
			}}
		>
			<Flex
				direction={{ initial: "column", md: "row" }}
				align="center"
				justify="between"
				gap="3"
				px="6"
				py="3"
			>
				{/* 左側：品牌與資料來源 */}
				<Flex align="center" gap="3" wrap="wrap" justify="center">
					<Text size="1" weight="bold">明日方舟 練度規劃表</Text>

					<Separator orientation="vertical" size="1" className="hidden sm:block" />

					<Flex gap="3" align="center">
						<Text size="1" style={{ color: "var(--slate-8)" }}>資料來源</Text>
						{sources.map(src => (
							<IconLink key={src.label} href={src.href} icon={src.icon}>
								{src.label}
							</IconLink>
						))}
					</Flex>
				</Flex>

				<Flex align="center" gap="2" wrap="wrap" justify="center">
					<Text size="1" color="gray" style={{ opacity: 0.7 }}>
						Made by
					</Text>
					<IconLink
						href="https://github.com/CoffeeChaton/rsbuild-mpa-demo"
						icon={<GitHubLogoIcon width="13" height="13" />}
						color="pink"
					>
						CoffeeChaton
					</IconLink>
				</Flex>
			</Flex>
		</footer>
	);
});

AppFooter.displayName = "AppFooter";
