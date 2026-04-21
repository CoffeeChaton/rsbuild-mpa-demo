import { describe, expect, it } from "vitest";
import { getCanonicalRedirect } from "./getCanonicalRedirect";

describe("getCanonicalRedirect 最終修復測試", () => {
	it("應該處理 index.html -> /", { timeout: 10000 }, () => {
		expect(getCanonicalRedirect("/index.html")).toBe("/");
		expect(getCanonicalRedirect("http://example.com/index.html")).toBe("/");
		expect(getCanonicalRedirect("/page/index.html")).toBe("/page/");
	});

	it("應該處理重複斜線並補全結尾斜線", { timeout: 10000 }, () => {
		expect(getCanonicalRedirect("/page//")).toBe("/page/");
		expect(getCanonicalRedirect("//game2")).toBe("/game2/"); // 開頭雙斜線也應修正
	});

	it("應該正確處理空格 %20", { timeout: 10000 }, () => {
		expect(getCanonicalRedirect("/page%20name")).toBe("/page%20name/");
	});

	it("應該解析相對路徑 /../", { timeout: 10000 }, () => {
		expect(getCanonicalRedirect("http://example.com/a/b/../c")).toBe("/a/c/");
	});

	it("不應該改動資源檔案", { timeout: 10000 }, () => {
		expect(getCanonicalRedirect("/style.css")).toBeNull();
		expect(getCanonicalRedirect("/logo.png?v=1")).toBeNull();
	});

	it("不應該改動正確的路徑", { timeout: 10000 }, () => {
		expect(getCanonicalRedirect("/")).toBeNull();
		expect(getCanonicalRedirect("/page/")).toBeNull();
	});
});
