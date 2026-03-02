import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProductView } from '../products/ProductView';
import { HomeView } from './HomeView';


export const App = () => {
  const prefix = process.env.ASSET_PREFIX || '/';

  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomeView />,
    },
    {
      path: '/products',
      element: <ProductView />,
    },
    {
      path: '*',
      element: <div className="p-20 text-center text-2xl">404 - 這裡什麼都沒有</div>,
    }
  ], { 
    basename: prefix 
  });

  return <RouterProvider router={router} />;
};
