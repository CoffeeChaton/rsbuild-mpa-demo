import { describe, expect, it } from "vitest";
import {
	getPageInfo,
	getPageInfoByPathname,
	getViewPagePath,
	isPageKey,
	NAV_ITEMS,
} from "./pages.runtime";

describe("pages runtime helpers", () => {
	it("checks page keys with a shared whitelist", { timeout: 10000 }, () => {
		expect(isPageKey("game2")).toBe(true);
		expect(isPageKey("404")).toBe(true);
		expect(isPageKey("toString")).toBe(false);
		expect(isPageKey("missing")).toBe(false);
	});

	it("resolves view page paths", { timeout: 10000 }, () => {
		expect(getViewPagePath("index")).toBe("/");
		expect(getViewPagePath("game3")).toBe("/game3/");
	});

	it("resolves page info from pathnames", { timeout: 10000 }, () => {
		expect(getPageInfoByPathname("/")).toEqual(getPageInfo("index"));
		expect(getPageInfoByPathname("/game2/")).toEqual(getPageInfo("game2"));
		expect(getPageInfoByPathname("///products///")).toEqual(getPageInfo("products"));
		expect(getPageInfoByPathname("/missing/route")).toEqual(getPageInfo("index"));
	});

	it("builds navbar items from shared runtime config", { timeout: 10000 }, () => {
		expect(NAV_ITEMS).toEqual([
			{ key: "index", path: "/", label: "首頁" },
			{ key: "products", path: "/products/", label: "產品" },
			{ key: "game2", path: "/game2/", label: "練度規劃表" },
			{ key: "game3", path: "/game3/", label: "材料未來視" },
		]);
	});
});
