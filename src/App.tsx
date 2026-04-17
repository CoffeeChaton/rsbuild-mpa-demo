// src/App.tsx
import { createBrowserRouter, type RouteObject, RouterProvider } from "react-router";
import { Layout } from "./pages/index/Layout.tsx";
import { VIEW_MAP } from "./common/router/view-map.ts";
import { Suspense } from "react";

const LOADING_FALLBACK = <div className="py-20 text-center">Loading...</div>;

// 直接定義 404 View (非 Lazy)
const NotFoundView: React.FC = () => (
	<>
		<Layout>
			<div className="h-[60vh] flex flex-col items-center justify-center">
				<h1 className="text-9xl font-black text-gray-200">404</h1>
				<p className="text-2xl font-bold mt-4">抱歉，頁面不存在</p>
				<a href="/" className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg">返回首頁</a>
			</div>
		</Layout>
	</>
);

function createRoutes(): RouteObject[] {
	return Object
		.keys(VIEW_MAP)
		.map((key) => {
			const View = VIEW_MAP[key as keyof typeof VIEW_MAP].Component;
			const path = key === "index"
				? "/"
				: `/${key}/`;

			return {
				path,
				Component: () => (
					<Layout>
						<Suspense fallback={LOADING_FALLBACK}>
							<View />
						</Suspense>
					</Layout>
				),
			};
		});
}

export const App: React.FC = () => {
	// 生成 ROUTES + 404
	const routes: RouteObject[] = [
		...createRoutes(),
		{ path: "*", Component: NotFoundView },
	];

	const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });

	return <RouterProvider router={router} />;
};
