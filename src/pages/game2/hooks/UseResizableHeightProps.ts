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
	const isResizingRef = useRef(false);
	const resizeHandlerRef = useRef<(e: MouseEvent) => void>(null!);
	const stopResizeRef = useRef<() => void>(null!);

	useEffect(() => {
		resizeHandlerRef.current = (e: MouseEvent) => {
			if (!isResizingRef.current) return;
			const newHeight = Math.max(minHeight, Math.min(maxHeight, window.innerHeight - e.clientY));
			if (panelRef.current) {
				panelRef.current.style.height = `${newHeight}px`;
			}
		};

		stopResizeRef.current = () => {
			if (!isResizingRef.current) return;
			isResizingRef.current = false;

			if (panelRef.current) {
				const finalHeight = panelRef.current.offsetHeight;
				setHeight(finalHeight);
				localStorage.setItem(key, String(finalHeight));
				panelRef.current.style.transition = "";
			}

			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			window.removeEventListener("mousemove", resizeHandlerRef.current);
			window.removeEventListener("mouseup", stopResizeRef.current);
		};
	}, [key, maxHeight, minHeight]);

	const startResizing = (e: React.MouseEvent): void => {
		if (isMobile) return;
		e.preventDefault();
		isResizingRef.current = true;
		if (panelRef.current) panelRef.current.style.transition = "none";
		document.body.style.cursor = "row-resize";
		document.body.style.userSelect = "none";
		window.addEventListener("mousemove", resizeHandlerRef.current);
		window.addEventListener("mouseup", stopResizeRef.current);
	};

	return { height, panelRef, startResizing };
};
