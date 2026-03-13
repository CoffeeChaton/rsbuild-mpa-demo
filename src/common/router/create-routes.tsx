import { Suspense } from "react";
import { Layout } from "../../pages/index/Layout";
import { VIEW_MAP } from "./view-map";

export function createRoutes() {
  return Object
    .keys(VIEW_MAP)
    .map((key) => {
      const View = VIEW_MAP[key as keyof typeof VIEW_MAP];
      const path = key === "index"
        ? "/"
        : `/${key}/`;

      return {
        path,
        element: (
          <Layout>
            <Suspense fallback={<div className="createRoutes_fallback"/>}>
              <View />
            </Suspense>
          </Layout>
        ),
      };
    });
}
