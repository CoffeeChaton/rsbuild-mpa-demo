import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './Layout';
import { Navbar } from '../../common/Navbar'; // 確保 404 也有導航

// Lazy Views
const HomeView = lazy(() => import('./HomeView.tsx').then(m => ({ default: m.HomeView })));
const ProductView = lazy(() => import('../products/ProductView.tsx').then(m => ({ default: m.ProductView })));
const MapEditView = lazy(() => import('../map-edit/MapEditView.tsx').then(m => ({ default: m.MapEditView })));
const GameView = lazy(() => import('../game/index.tsx').then(m => ({ default: m.App })));

// IniConfigurationEditor


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
    {
      path: '/',
      element: (
        <Layout>
          <Suspense fallback={null}><HomeView /></Suspense>
        </Layout>
      ),
    },
    {
      path: '/products',
      element: (
        <Layout>
          <Suspense fallback={null}><ProductView /></Suspense>
        </Layout>
      ),
    },
    {
      path: '/map-edit', // 對應 PAGE_MAP 的 Key
      element: <Layout><Suspense fallback={null}><MapEditView /></Suspense></Layout>,
    },
    {
      path: "/game",
      element: <Layout><Suspense fallback={null}><GameView /></Suspense></Layout>,
    },
    {
      path: '*', // 這裡接管所有未定義路徑
      element: <Layout><NotFoundView /></Layout>,
    },
  ], { basename: process.env.ASSET_PREFIX || '/' });

  return <RouterProvider router={router} />;
};
