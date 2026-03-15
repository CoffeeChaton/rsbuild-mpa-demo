export interface IPageInfo {
	title: string;
	description: string;
	label: string; // 用於 Navbar 顯示的文字
	hidden?: boolean; // 是否在 Navbar 隱藏（例如 404）
}

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
	"map-edit": { // 新增地圖編輯頁面
		title: "地圖編輯器 - GIS 控制台",
		description: "自定義您的地圖偏好與中心點",
		label: "地圖編輯",
	},
	"game": {
		title: "明日方舟 資源計畫器",
		description: "資源計畫器",
		label: "資源計畫器(預計刪除)",
	},
	"game2": {
		title: "明日方舟 練度規劃表",
		description: "練度規劃表",
		label: "練度規劃表",
	},
	"game3": {
		title: "明日方舟 材料未來視",
		description: "材料未來視 計算器",
		label: "材料未來視 計算器",
	},
	"404": {
		title: "404 - 找不到頁面",
		description: "抱歉，您訪問的頁面不存在",
		label: "404",
		hidden: true,
	},
} as const as Record<"index" | "products" | "map-edit" | "game" | "game2" | "game3" | "404", IPageInfo>;

// 定義導出的 Key 型別，供其他工具使用
export type TPageKey = keyof typeof PAGE_MAP;
