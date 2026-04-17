import { cn } from "@/src/lib/utils";

type TIconLinkColor = "default" | "pink";

interface IconLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	color?: TIconLinkColor;
	icon?: React.ReactNode;
}

const colorClassMap: Record<TIconLinkColor, string> = {
	default: "text-[var(--gray-11)] hover:text-[var(--gray-12)]",
	pink: "text-[var(--pink-11)] hover:text-[var(--pink-12)]",
};

export const IconLink: React.FC<IconLinkProps> = ({
	href,
	icon,
	children,
	color = "default",
	className,
	...restProps
}) => {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			draggable={false}
			className={cn(
				"inline-flex max-w-max flex-none items-center gap-1 whitespace-nowrap break-normal text-xs leading-none underline-offset-2 transition-colors break-keep",
				colorClassMap[color],
				className,
			)}
			{...restProps}
		>
			{icon ? <span className="shrink-0">{icon}</span> : null}
			<span className="inline-block whitespace-nowrap break-keep">{children}</span>
		</a>
	);
};
