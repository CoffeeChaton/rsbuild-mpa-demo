/// src/common/router/view-map.ts

import type { LazyExoticComponent } from "react";
import type { TViewPageKey } from "../config/pages.config";
import { lazy } from "react";

// 定義頁面模組的標準形狀
interface IPageModule {
	App: React.FC;
}

type TLoader = () => Promise<IPageModule>;
type TLazyPageReurn = {
	Component: LazyExoticComponent<React.FC>,
	loader: TLoader,
};

type TLazyPageFn = (loader: TLoader) => TLazyPageReurn;

const lazyPage: TLazyPageFn = (loader) => {
	const Component = lazy(async () => loader().then(m => ({ default: m.App })));
	return {
		Component,
		loader,
	};
};

/**
 * use https://rspack.rs/api/runtime-api/module-methods#magic-comments
 */
export const VIEW_MAP: Record<TViewPageKey, TLazyPageReurn> = {
	index: lazyPage(async () => import(/* webpackChunkName: "p-index" */ "../../pages/index/index")),
	products: lazyPage(async () => import(/* webpackChunkName: "p-products" */ "../../pages/products/index")),
	game2: lazyPage(async () => import(/* webpackChunkName: "p-game2" */ "../../pages/game2/index")),
	game3: lazyPage(async () => import(/* webpackChunkName: "p-game3" */ "../../pages/game3/index")),
};
