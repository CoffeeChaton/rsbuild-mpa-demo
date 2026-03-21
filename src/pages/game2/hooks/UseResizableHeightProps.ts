// @file src/hooks/use-resizable-height.ts
import { type RefObject, useEffect, useRef, useState } from "react";

interface UseResizableHeightProps {
	key: string;
	defaultHeight: number;
	minHeight: number;
	maxHeight: number;
	isMobile: boolean;
}

export type TUseResizableHeight = (prop: UseResizableHeightProps) => {
	height: number,
	panelRef: RefObject<HTMLDivElement | null>,
	startResizing: (e: React.MouseEvent) => void,
};

export const useResizableHeight: TUseResizableHeight = ({
	key,
	defaultHeight,
	minHeight,
	maxHeight,
	isMobile,
}) => {
	const [height, setHeight] = useState<number>(() => {
		if (typeof window === "undefined") return defaultHeight;
		const saved = localStorage.getItem(key);
		return saved ? Math.min(maxHeight, Math.max(minHeight, Number(saved))) : defaultHeight;
	});

	const panelRef = useRef<HTMLDivElement>(null);
	const isResizing = useRef(false);
	const handleResizeRef = useRef<(e: MouseEvent) => void>(null!);
	const stopResizingRef = useRef<() => void>(null!);

	useEffect(() => {
		handleResizeRef.current = (e: MouseEvent) => {
			if (!isResizing.current) return;
			const newHeight = Math.max(minHeight, Math.min(maxHeight, window.innerHeight - e.clientY));
			if (panelRef.current) {
				panelRef.current.style.height = `${newHeight}px`;
			}
		};

		stopResizingRef.current = () => {
			if (!isResizing.current) return;
			isResizing.current = false;

			if (panelRef.current) {
				const finalHeight = panelRef.current.offsetHeight;
				setHeight(finalHeight);
				localStorage.setItem(key, String(finalHeight));
				panelRef.current.style.transition = "";
			}

			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			window.removeEventListener("mousemove", handleResizeRef.current);
			window.removeEventListener("mouseup", stopResizingRef.current);
		};
	}, [key, maxHeight, minHeight]);

	const startResizing = (e: React.MouseEvent): void => {
		if (isMobile) return;
		e.preventDefault();
		isResizing.current = true;
		if (panelRef.current) panelRef.current.style.transition = "none";
		document.body.style.cursor = "row-resize";
		document.body.style.userSelect = "none";
		window.addEventListener("mousemove", handleResizeRef.current);
		window.addEventListener("mouseup", stopResizingRef.current);
	};

	return { height, panelRef, startResizing };
};
