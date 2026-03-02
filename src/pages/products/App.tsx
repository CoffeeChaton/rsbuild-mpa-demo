import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Navbar } from '../../common/Navbar';

export const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Navbar currentPage="products" />
          <main className="p-8">
            <h1 className="text-2xl font-bold">產品頁面</h1>
            <p>這是 CSR 渲染的內容</p>
          </main>
        </>
      ),
    }
  ], { basename: '/products' }); // 關鍵：讓該 Entry 的路由相對於物理路徑

  return <RouterProvider router={router} />;
};
