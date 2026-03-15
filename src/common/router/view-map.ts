/// src/common/router/view-map.ts

import { lazy } from "react";
import type { TPageKey } from "../config/pages";
import type { FC, LazyExoticComponent } from "react";

// 定義頁面模組的標準形狀
interface IPageModule {
	App: React.FC; // 使用 unknown 代替 any，符合你的規範
}

function lazyPage(
	loader: () => Promise<IPageModule>,
): LazyExoticComponent<React.FC> {
	return lazy(() => loader().then(m => ({ default: m.App })));
}

export const VIEW_MAP: {
	index: LazyExoticComponent<FC>,
	products: LazyExoticComponent<FC>,
	"map-edit": LazyExoticComponent<FC>,
	game: LazyExoticComponent<FC>,
	game2: LazyExoticComponent<FC>,
	game3: LazyExoticComponent<FC>,
} = {
	index: lazyPage(() => import("../../pages/index/index")),
	products: lazyPage(() => import("../../pages/products/index")),
	"map-edit": lazyPage(() => import("../../pages/map-edit/index")),
	game: lazyPage(() => import("../../pages/game/index")),
	game2: lazyPage(() => import("../../pages/game2/index")),
	game3: lazyPage(() => import("../../pages/game3/index")),
} satisfies Record<
	Exclude<TPageKey, "404">,
	LazyExoticComponent<React.FC>
>;
