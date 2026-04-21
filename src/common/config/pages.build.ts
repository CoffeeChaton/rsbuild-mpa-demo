import {
	getConfigPageInfo,
	hasCleanupDir,
	type IPageInfo,
	PAGE_DEFINITION_MAP,
	PAGE_DEFINITIONS,
	type TPageDefinition,
	type TPageKey,
} from "./pages.config";

function getPageDefinition(key: TPageKey): TPageDefinition {
	const page = PAGE_DEFINITION_MAP.get(key);
	if (page !== undefined) {
		return page;
	}

	throw new Error(`Unknown page key: ${key}`);
}

export function getPageEntryName(key: TPageKey): string {
	return getPageDefinition(key).entryName;
}

export function getPageInfo(key: TPageKey): IPageInfo {
	return getConfigPageInfo(key);
}

export function getPageOutputPath(key: TPageKey): string {
	return getPageDefinition(key).outputPath;
}

export function getPageCleanupDir(key: TPageKey): string | undefined {
	const definition = getPageDefinition(key);
	return hasCleanupDir(definition) ? definition.cleanupDir : undefined;
}

export function getPageInfoByEntryName(entryName: string): IPageInfo {
	const normalizedEntryName = entryName === "" ? "" : entryName;

	for (const page of PAGE_DEFINITIONS) {
		if (page.entryName === normalizedEntryName) {
			return getConfigPageInfo(page.key);
		}
	}

	return getConfigPageInfo("index");
}
