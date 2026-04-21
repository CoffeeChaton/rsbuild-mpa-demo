import { ScrollArea } from "@radix-ui/themes";
import * as React from "react";
import { type ComponentProps, useMemo } from "react";
import { cn } from "../../lib/utils";

interface TableProps extends ComponentProps<"table"> {
	/** 容器樣式類名，超出時滾動 */
	containerClassName?: string;
	/** 是否使用固定佈局，避免頻繁 Layout */
	fixed?: boolean;
}

function Table({ className, containerClassName, fixed, ...props }: TableProps): React.JSX.Element {
	return (
		<ScrollArea
			data-slot="table-container"
			scrollbars="both"
			className={cn("h-full w-full", containerClassName)}
		>
			<table
				data-slot="table"
				// 使用 table-fixed 是優化效能的關鍵
				className={cn(
					"w-full caption-bottom text-sm border-collapse",
					fixed ? "table-fixed" : "table-auto",
					className,
				)}
				{...props}
			/>
		</ScrollArea>
	);
}

interface TableHeaderProps extends ComponentProps<"thead"> {
	/** 是否固定表頭 */
	sticky?: boolean;
}

function TableHeader({ className, sticky, ...props }: TableHeaderProps): React.JSX.Element {
	return (
		<thead
			data-slot="table-header"
			className={cn(
				"[&_tr]:border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
				sticky && "sticky top-0 z-10 shadow-sm", // 黏性表頭
				className,
			)}
			{...props}
		/>
	);
}

function TableBody({ className, ...props }: ComponentProps<"tbody">): React.JSX.Element {
	return (
		<tbody
			data-slot="table-body"
			className={cn("[&_tr:last-child]:border-0", className)}
			{...props}
		/>
	);
}

function TableFooter({ className, ...props }: ComponentProps<"tfoot">): React.JSX.Element {
	return (
		<tfoot
			data-slot="table-footer"
			className={cn(
				"border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
				className,
			)}
			{...props}
		/>
	);
}

function TableRow({ className, ...props }: ComponentProps<"tr">): React.JSX.Element {
	return (
		<tr
			data-slot="table-row"
			className={cn(
				"border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
				className,
			)}
			{...props}
		/>
	);
}

interface TableHeadProps extends ComponentProps<"th"> {
	/** 強制輸入寬度 */
	width: number | string;
}

function TableHead({ className, width, ...props }: TableHeadProps): React.JSX.Element {
	const headStyle = useMemo(() => ({
		width,
		minWidth: width,
		maxWidth: width,
	}), [width]);

	return (
		<th
			data-slot="table-head"
			style={headStyle}
			className={cn(
				"h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground overflow-hidden text-ellipsis border-r last:border-r-0 border-border/50",
				className,
			)}
			{...props}
		/>
	);
}

function TableCell({ className, ...props }: ComponentProps<"td">): React.JSX.Element {
	return (
		<td
			data-slot="table-cell"
			className={cn(
				"p-2 align-middle whitespace-nowrap overflow-hidden text-ellipsis border-r last:border-r-0 border-border/50",
				className,
			)}
			{...props}
		/>
	);
}

function TableCaption({
	className,
	...props
}: ComponentProps<"caption">): React.JSX.Element {
	return (
		<caption
			data-slot="table-caption"
			className={cn("mt-4 text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
