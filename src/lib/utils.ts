import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

/** 判斷是否為 Mac 系統 */
export const isMac = (): boolean => {
	if (typeof window === "undefined") return false;
	return /Macintosh|Mac OS X/i.test(window.navigator.userAgent);
};

/** 取得對應系統的輔助鍵名稱 (⌘ 或 Ctrl) */
export const getModifierKey = (): "Ctrl" | "⌘" => {
	if (typeof window === "undefined") return "Ctrl";
	return isMac() ? "⌘" : "Ctrl";
};
