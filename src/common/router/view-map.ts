/// src/common/router/view-map.ts

import { lazy } from "react";
import type { TPageKey } from "../config/pages";
import type { LazyExoticComponent } from "react";

// 定義頁面模組的標準形狀
interface IPageModule {
	App: React.FC;
}

type TLoader = () => Promise<IPageModule>;

function lazyPage(loader: TLoader): React.LazyExoticComponent<React.FC> {
	return lazy(() => loader().then(m => ({ default: m.App })));
}

export const VIEW_MAP: Record<
	Exclude<TPageKey, "404">,
	LazyExoticComponent<React.FC>
> = {
	// 使用 Magic Comments 賦予檔案有意義的名字
	index: lazyPage(() => import(/* webpackChunkName: "p-index" */ "../../pages/index/index")),
	products: lazyPage(() => import(/* webpackChunkName: "p-products" */ "../../pages/products/index")),
	"map-edit": lazyPage(() => import(/* webpackChunkName: "p-map-edit" */ "../../pages/map-edit/index")),
	game: lazyPage(() => import(/* webpackChunkName: "p-game" */ "../../pages/game/index")),
	game2: lazyPage(() => import(/* webpackChunkName: "p-game2" */ "../../pages/game2/index")),
	game3: lazyPage(() => import(/* webpackChunkName: "p-game3" */ "../../pages/game3/index")),
};
