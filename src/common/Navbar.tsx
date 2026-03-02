import { Link, useLocation } from 'react-router-dom';
import { PAGE_MAP } from './config/pages';

export const Navbar = () => {
  const location = useLocation();
  const prefix = process.env.ASSET_PREFIX || '/';

  const navItems = Object.entries(PAGE_MAP)
    .filter(([_, info]) => !info.hidden)
    .map(([key, info]) => ({
      key,
      path: key === 'index' ? '/' : `/${key}`,
      label: info.label,
    }));

  return (
    <nav className="flex items-center gap-6 p-4 border-b bg-white shadow-sm">
      <div className="text-xl font-black text-blue-600">BRAND</div>
      <div className="flex gap-4">
        {navItems.map((item) => {
          // 精確匹配當前路由
          const isActive = location.pathname === item.path || 
                          (item.path === '/' && location.pathname === '');

          return (
            <Link
              key={item.key}
              to={item.path}
              className={`${
                isActive ? 'text-blue-600 font-bold' : 'text-gray-500'
              } hover:text-blue-500 transition-colors px-1`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
