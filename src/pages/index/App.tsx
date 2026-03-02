import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navbar } from "../../common/Navbar";

// src/pages/index/App.tsx
export const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Navbar currentPage="index" />
          <h1 className="p-10 text-3xl font-bold">首頁大廳</h1>
        </>
      ),
    },
  ], { 
    // 首頁直接使用環境變數中的前綴作為 basename
    basename: process.env.ASSET_PREFIX || '/' 
  });

  return <RouterProvider router={router} />;
};
