import { describe, expect, it } from "vitest";
import {
	hasCleanupDir,
	NOT_FOUND_PAGE_KEY,
	PAGE_DEFINITION_MAP,
	PAGE_DEFINITIONS,
	PAGE_INFO_MAP,
	PAGE_KEYS,
	VIEW_PAGE_KEYS,
} from "./pages.config";

describe("pages config", () => {
	it("keeps one page definition per page key", () => {
		expect(PAGE_DEFINITIONS).toHaveLength(5);
		expect(PAGE_KEYS).toEqual(["index", "products", "game2", "game3", "404"]);
		expect(VIEW_PAGE_KEYS).toEqual(["index", "products", "game2", "game3"]);
	});

	it("keeps shared lookup maps aligned with definitions", () => {
		expect(PAGE_DEFINITION_MAP.get("index")?.entryName).toBe("");
		const notFoundDefinition = PAGE_DEFINITION_MAP.get(NOT_FOUND_PAGE_KEY);
		expect(notFoundDefinition && hasCleanupDir(notFoundDefinition) ? notFoundDefinition.cleanupDir : undefined).toBe("404");
		expect(PAGE_INFO_MAP.get("game3")?.title).toBe("明日方舟 材料未來視");
		expect(PAGE_INFO_MAP.get("404")?.hidden).toBe(true);
	});
});
