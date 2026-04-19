import { describe, expect, it } from "vitest";
import {
	getPageCleanupDir,
	getPageEntryName,
	getPageInfoByEntryName,
	getPageOutputPath,
} from "./pages.build";
import { getPageInfo } from "./pages.runtime";

describe("pages build helpers", () => {
	it("resolves entry names and output paths", () => {
		expect(getPageEntryName("index")).toBe("");
		expect(getPageEntryName("products")).toBe("products");
		expect(getPageOutputPath("game2")).toBe("game2/index.html");
		expect(getPageOutputPath("404")).toBe("404.html");
		expect(getPageCleanupDir("404")).toBe("404");
		expect(getPageCleanupDir("index")).toBeUndefined();
	});

	it("resolves page info from entry names", () => {
		expect(getPageInfoByEntryName("")).toEqual(getPageInfo("index"));
		expect(getPageInfoByEntryName("game3")).toEqual(getPageInfo("game3"));
		expect(getPageInfoByEntryName("unknown")).toEqual(getPageInfo("index"));
	});
});
