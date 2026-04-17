export interface IPageInfo {
	title: string;
	description: string;
	label: string; // 用於 Navbar 顯示的文字
	hidden?: boolean; // 是否在 Navbar 隱藏（例如 404）
}

export type TPageKey =
	| "index"
	| "products"
	| "game2"
	| "game3"
	| "404";

export const PAGE_MAP = {
	index: {
		title: "首頁 - 品牌門面",
		description: "歡迎來到我們的品牌官網",
		label: "首頁",
	},
	products: {
		title: "產品清單 - 優質選物",
		description: "探索我們精選的產品系列",
		label: "產品",
	},
	"game2": {
		title: "明日方舟 練度規劃表",
		description: "練度規劃表",
		label: "練度規劃表",
	},
	"game3": {
		title: "明日方舟 材料未來視",
		description: "材料未來視",
		label: "材料未來視",
	},
	"404": {
		title: "404 - 找不到頁面",
		description: "抱歉，您訪問的頁面不存在",
		label: "404",
		hidden: true,
	},
} as const as Record<TPageKey, IPageInfo>;
