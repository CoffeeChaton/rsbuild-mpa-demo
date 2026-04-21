import { Suspense } from "react";
import { createBrowserRouter, type RouteObject, RouterProvider } from "react-router";
import { getViewPagePath, VIEW_PAGE_KEYS } from "./common/config/pages.runtime";
import { VIEW_MAP } from "./common/router/view-map.ts";
import { Layout } from "./pages/index/Layout.tsx";

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

interface IViewRouteProps {
	View: React.ComponentType;
}

const ViewRoute: React.FC<IViewRouteProps> = ({ View }) => (
	<Layout>
		<Suspense fallback={LOADING_FALLBACK}>
			<View />
		</Suspense>
	</Layout>
);

function createRoutes(): RouteObject[] {
	return VIEW_PAGE_KEYS.map((key) => {
		const View = VIEW_MAP[key].Component;
		const path = getViewPagePath(key);

		return {
			path,
			element: <ViewRoute View={View} />,
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
