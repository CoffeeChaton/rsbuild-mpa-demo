import { createBrowserRouter, type RouteObject, RouterProvider } from "react-router-dom";
import { Navbar } from "../../common/Navbar"; // 確保 404 也有導航
import { createRoutes } from "../../common/router/create-routes.tsx";
import { Layout } from "./Layout.tsx";

// 直接定義 404 View (非 Lazy)
const NotFoundView = () => (
	<>
		<Layout>
			<Navbar />
			<div className="h-[60vh] flex flex-col items-center justify-center">
				<h1 className="text-9xl font-black text-gray-200">404</h1>
				<p className="text-2xl font-bold mt-4">抱歉，頁面不存在</p>
				<a href="/" className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg">返回首頁</a>
			</div>
		</Layout>
	</>
);

export const App = () => {
	// 生成 ROUTES + 404
	const routes: RouteObject[] = [
		...createRoutes(),
		{ path: "*", element: <NotFoundView /> },
	];

	const router = createBrowserRouter(routes, {
		basename: import.meta.env.BASE_URL || "/",
	});

	return <RouterProvider router={router} />;
};
