/// src/common/router/view-map.ts

import { lazy } from "react"
import type { TPageKey } from "../config/pages"

function lazyPage<T extends { App: React.ComponentType<any> }>(
  loader: () => Promise<T>
) {
  return lazy(() => loader().then(m => ({ default: m.App })))
}

export const VIEW_MAP = {

  index: lazyPage(() => import("../../pages/index/index")),
  products: lazyPage(() => import("../../pages/products/index")),
  "map-edit": lazyPage(() => import("../../pages/map-edit/index")),
  game: lazyPage(() => import("../../pages/game/index")),
  game2: lazyPage(() => import("../../pages/game2/index")),
  game3: lazyPage(() => import("../../pages/game3/index")),

} satisfies Record<
  Exclude<TPageKey, "404">,
  React.LazyExoticComponent<React.ComponentType<any>>
>
