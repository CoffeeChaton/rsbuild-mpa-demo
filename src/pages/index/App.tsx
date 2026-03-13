import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./Layout";
import { Navbar } from "../../common/Navbar"; // 確保 404 也有導航
import { createRoutes } from "../../common/router/create-routes.tsx";

// 直接定義 404 View (非 Lazy)
const NotFoundView = () => (
  <>
    <Navbar />
    <div className="h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-9xl font-black text-gray-200">404</h1>
      <p className="text-2xl font-bold mt-4">喔喔！這個頁面跑掉了</p>
      <a href="/" className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg">返回首頁</a>
    </div>
  </>
);

export const App = () => {
  const router = createBrowserRouter([
    ...createRoutes(),
    {
      path: "*",
      element: (
        <Layout>
          <NotFoundView />
        </Layout>
      ),
    },
  ], {
    basename: import.meta.env.BASE_URL,
  });
  return (
    <Suspense fallback={<div className="suspense_fallback" />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};
