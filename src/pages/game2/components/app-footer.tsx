import * as React from "react";
import { memo } from "react";
import { ExternalLinkIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { IconLink } from "@/src/common/components/IconLink";

const SOURCE_ICON = <GitHubLogoIcon width="13" height="13" />;
const PRTS_ICON = <ExternalLinkIcon width="13" height="13" />;

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
			icon: SOURCE_ICON,
		},
		{
			label: "PRTS Wiki",
			href: "https://prts.wiki/w/干员升级数值",
			icon: PRTS_ICON,
		},
	];

	return (
		<footer className="border-t border-(--slate-4) bg-(--slate-1)">
			<div className="flex flex-col items-center justify-between gap-3 px-6 py-3 md:flex-row">
				<div className="flex min-w-0 flex-wrap items-center justify-center gap-3">
					<span className="text-xs font-bold text-foreground">明日方舟 練度規劃表</span>

					<span className="hidden h-4 w-px bg-(--slate-6) sm:block" />

					<div className="flex min-w-0 max-w-full flex-nowrap items-center gap-3 overflow-x-auto overflow-y-hidden whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
						<span className="shrink-0 text-xs text-(--slate-8)">資料來源</span>
						{sources.map(src => (
							<IconLink
								key={src.label}
								href={src.href}
								icon={src.icon}
								className="shrink-0"
								color="pink"
							>
								{src.label}
							</IconLink>
						))}
					</div>
				</div>

				<div className="flex min-w-0 flex-wrap items-center justify-center gap-2">
					<span className="text-xs text-(--gray-11) opacity-70">Made by</span>
					<IconLink
						href="https://github.com/CoffeeChaton/rsbuild-mpa-demo"
						icon={SOURCE_ICON}
						color="pink"
						className="shrink-0"
					>
						CoffeeChaton
					</IconLink>
				</div>
			</div>
		</footer>
	);
});

AppFooter.displayName = "AppFooter";
