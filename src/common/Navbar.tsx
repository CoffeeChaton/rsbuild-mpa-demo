import { Link, useLocation } from 'react-router-dom';
import { PAGE_MAP, type IPageInfo, type TPageKey } from './config/pages';
import { getStaticPath } from './utils/path';

export const Navbar = () => {
  const location = useLocation();

  // 1. 整理導航資料（保持相對路徑，交給 React Router 的 basename 處理）
  // 1. 取得 Key 並強制轉型為我們定義的 TPageKey 陣列
  const navKeys = Object.keys(PAGE_MAP) as TPageKey[];

  // 2. 進行過濾與對齊
  const navItems = navKeys
    .filter((key) => {
      // 這裡 info 會精確推導為 IPageInfo
      const info: IPageInfo = PAGE_MAP[key];
      return !info.hidden;
    })
    .map((key) => {
      const info = PAGE_MAP[key];
      return {
        key,
        path: getStaticPath(key),
        label: info.label,
      };
    });

  return (
    <nav className="flex items-center gap-6 p-4 border-b bg-white shadow-sm">
      <div className="text-xl font-black text-blue-600">BRAND</div>
      <div className="flex gap-4">
        {navItems.map((item) => {
          // 2. 使用 useLocation 進行狀態比對
          // 移除末尾斜槓以確保匹配一致性 (例如 /products/ 與 /products)
          const current = location.pathname.replace(/\/+$/, '') || '/';
          const target = item.path.replace(/\/+$/, '') || '/';
          const isActive = current === target;

          return (
            <Link
              key={item.key}
              to={item.path} // React Router 會根據 basename 自動補上 /repo-name
              className={`${isActive ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-500'
                } hover:text-blue-500 transition-colors px-1 pb-1`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
