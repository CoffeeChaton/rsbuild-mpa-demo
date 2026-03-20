import { Link } from "@radix-ui/themes";

// 1. 取得 Radix Link 的所有原始 Props 類型
type RadixLinkProps = React.ComponentPropsWithoutRef<typeof Link>;

// 2. 擴充介面，加入我們自定義的 icon 參數
interface IconLinkProps extends RadixLinkProps {
	icon?: React.ReactNode;
}

export const IconLink: React.FC<IconLinkProps> = ({
	href,
	icon,
	children,
	style,
	className,
	...restProps // 這裡包含了 color, size, highContrast, weight 等
}) => (
	<Link
		href={href}
		size="1"
		target="_blank"
		rel="noopener noreferrer"
		asChild
		{...restProps}
	>
		<a
			className={className}
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: "4px",
				whiteSpace: "nowrap",
				transition: "color 0.2s ease",
				cursor: "pointer",
				...style, // 允許外部傳入 style 覆蓋或增加樣式
			}}
		>
			{icon}
			{children}
		</a>
	</Link>
);
