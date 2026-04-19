export interface IPageInfo {
	title: string;
	description: string;
	label: string;
	hidden?: boolean;
}

interface IPageDefinition {
	key: string;
	info: IPageInfo;
	entryName: string;
	outputPath: string;
	cleanupDir?: string;
	isView: boolean;
}

type TPageDefinitionEntry<
	TKey extends string,
	TEntryName extends string,
	TOutputPath extends string,
	TIsView extends boolean,
> = Readonly<{
	key: TKey,
	info: IPageInfo,
	entryName: TEntryName,
	outputPath: TOutputPath,
	isView: TIsView,
	cleanupDir?: string,
}>;

type TPageDefinitionList = readonly [
	TPageDefinitionEntry<"index", "", "index.html", true>,
	TPageDefinitionEntry<"products", "products", "products/index.html", true>,
	TPageDefinitionEntry<"game2", "game2", "game2/index.html", true>,
	TPageDefinitionEntry<"game3", "game3", "game3/index.html", true>,
	Readonly<{
		key: "404",
		info: IPageInfo,
		entryName: "404",
		outputPath: "404.html",
		cleanupDir: "404",
		isView: false,
	}>,
];

function createPageDefinitions(): TPageDefinitionList {
	return [
		{
			key: "index",
			info: {
				title: "首頁 - 品牌門面",
				description: "歡迎來到我們的品牌官網",
				label: "首頁",
			},
			entryName: "",
			outputPath: "index.html",
			isView: true,
		},
		{
			key: "products",
			info: {
				title: "產品清單 - 優質選物",
				description: "探索我們精選的產品系列",
				label: "產品",
			},
			entryName: "products",
			outputPath: "products/index.html",
			isView: true,
		},
		{
			key: "game2",
			info: {
				title: "明日方舟 練度規劃表",
				description: "練度規劃表",
				label: "練度規劃表",
			},
			entryName: "game2",
			outputPath: "game2/index.html",
			isView: true,
		},
		{
			key: "game3",
			info: {
				title: "明日方舟 材料未來視",
				description: "材料未來視",
				label: "材料未來視",
			},
			entryName: "game3",
			outputPath: "game3/index.html",
			isView: true,
		},
		{
			key: "404",
			info: {
				title: "404 - 找不到頁面",
				description: "抱歉，您訪問的頁面不存在",
				label: "404",
				hidden: true,
			},
			entryName: "404",
			outputPath: "404.html",
			cleanupDir: "404",
			isView: false,
		},
	] as const satisfies ReadonlyArray<IPageDefinition>;
}

const PAGE_DEFINITIONS_INTERNAL: ReturnType<typeof createPageDefinitions> = createPageDefinitions();
export const PAGE_DEFINITIONS: readonly (typeof PAGE_DEFINITIONS_INTERNAL)[number][] = PAGE_DEFINITIONS_INTERNAL;

export type TPageDefinition = (typeof PAGE_DEFINITIONS)[number];
export type TPageKey = TPageDefinition["key"];
export type TViewPageKey = Extract<TPageDefinition, { isView: true }>["key"];
export type TPageDefinitionWithCleanupDir = Extract<TPageDefinition, { cleanupDir: string }>;

export const NOT_FOUND_PAGE_KEY: TPageKey = "404";
export const PAGE_KEYS: ReadonlyArray<TPageKey> = PAGE_DEFINITIONS.map(page => page.key);
export const VIEW_PAGE_KEYS: ReadonlyArray<TViewPageKey> = PAGE_DEFINITIONS
	.filter((page): page is Extract<TPageDefinition, { isView: true }> => page.isView)
	.map(page => page.key);

export const PAGE_KEY_SET: ReadonlySet<string> = new Set(PAGE_KEYS);
export const PAGE_DEFINITION_MAP: ReadonlyMap<TPageKey, TPageDefinition> = new Map<TPageKey, TPageDefinition>(
	PAGE_DEFINITIONS.map(page => [page.key, page]),
);

export function hasCleanupDir(page: TPageDefinition): page is TPageDefinitionWithCleanupDir {
	return Object.hasOwn(page, "cleanupDir");
}

function createPageInfoMap(): ReadonlyMap<TPageKey, IPageInfo> {
	const pageInfoMap = new Map<TPageKey, IPageInfo>();

	for (const page of PAGE_DEFINITIONS) {
		pageInfoMap.set(page.key, page.info);
	}

	return pageInfoMap;
}

function createViewPageInfoMap(): ReadonlyMap<TViewPageKey, IPageInfo> {
	const viewPageInfoMap = new Map<TViewPageKey, IPageInfo>();

	for (const page of PAGE_DEFINITIONS) {
		if (page.isView) {
			viewPageInfoMap.set(page.key, page.info);
		}
	}

	return viewPageInfoMap;
}

export const PAGE_INFO_MAP: ReadonlyMap<TPageKey, IPageInfo> = createPageInfoMap();
export const VIEW_PAGE_INFO_MAP: ReadonlyMap<TViewPageKey, IPageInfo> = createViewPageInfoMap();

export function getConfigPageInfo(key: TPageKey): IPageInfo {
	const pageInfo = PAGE_INFO_MAP.get(key);
	if (pageInfo !== undefined) {
		return pageInfo;
	}

	throw new Error(`Unknown page info key: ${key}`);
}

export function getConfigViewPageInfo(key: TViewPageKey): IPageInfo {
	const pageInfo = VIEW_PAGE_INFO_MAP.get(key);
	if (pageInfo !== undefined) {
		return pageInfo;
	}

	throw new Error(`Unknown view page info key: ${key}`);
}
