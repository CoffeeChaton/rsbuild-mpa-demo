import {
	getConfigPageInfo,
	getConfigViewPageInfo,
	type IPageInfo,
	PAGE_KEY_SET,
	type TPageKey,
	type TViewPageKey,
	VIEW_PAGE_KEYS,
} from "./pages.config";

export type { IPageInfo, TPageKey, TViewPageKey } from "./pages.config";
export { NOT_FOUND_PAGE_KEY, PAGE_INFO_MAP, PAGE_KEYS, VIEW_PAGE_INFO_MAP, VIEW_PAGE_KEYS } from "./pages.config";

export interface INavItem {
	key: TViewPageKey;
	path: string;
	label: string;
}

export function isPageKey(value: string): value is TPageKey {
	return PAGE_KEY_SET.has(value);
}

export function getPageInfo(key: TPageKey): IPageInfo {
	return getConfigPageInfo(key);
}

export function getViewPagePath(key: TViewPageKey): string {
	return key === "index" ? "/" : `/${key}/`;
}

export function getPageInfoByPathname(pathname: string): IPageInfo {
	const normalizedPath = pathname.replace(/^\/+/, "").split("/")[0] || "index";
	return isPageKey(normalizedPath) ? getPageInfo(normalizedPath) : getPageInfo("index");
}

export const NAV_ITEMS: readonly INavItem[] = VIEW_PAGE_KEYS
	.filter((key) => !getConfigViewPageInfo(key).hidden)
	.map((key) => ({
		key,
		path: getViewPagePath(key),
		label: getConfigViewPageInfo(key).label,
	}));
