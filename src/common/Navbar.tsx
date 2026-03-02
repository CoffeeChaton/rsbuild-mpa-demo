import { Link } from 'react-router-dom';
import { PAGE_MAP } from './config/pages';

interface NavbarProps {
  currentPage: string;
}

export const Navbar = ({ currentPage }: NavbarProps) => {
  const prefix = process.env.ASSET_PREFIX || '/';

  const navItems = Object.entries(PAGE_MAP)
    .filter(([_, info]) => !info.hidden)
    .map(([key, info]) => ({
      key,
      label: info.label,
      // 跨 Entry 使用的絕對路徑 (MPA)
      absolutePath: key === 'index' ? prefix : `${prefix}${key}`,
    }));

  return (
    <nav className="flex items-center gap-6 p-4 border-b bg-white shadow-sm">
      <div className="text-xl font-black text-blue-600 mr-4">BRAND</div>
      <div className="flex gap-4">
        {navItems.map((item) => {
          const isSameEntry = currentPage === item.key;

          return isSameEntry ? (
            /* 情境：在 products 頁面點擊「產品」
               處理：跳向 Link 路由的 "/"。
               因為 App.tsx 有設 basename='/products'，所以 Link to="/" 
               會正確留在 http://localhost:3000/products 而不疊加。
            */
            <Link
              key={item.key}
              to="/" 
              className="text-blue-600 font-bold border-b-2 border-blue-600 px-1"
            >
              {item.label}
            </Link>
          ) : (
            /* 情境：跨 Entry (例如從 products 跳回首頁)
               處理：使用原生 <a> 跳向物理絕對路徑。
            */
            <a
              key={item.key}
              href={item.absolutePath}
              className="text-gray-500 hover:text-blue-500 transition-colors px-1"
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
};
