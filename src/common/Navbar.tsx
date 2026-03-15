import { Link, useLocation } from "react-router-dom";
import { type IPageInfo, PAGE_MAP, type TPageKey } from "./config/pages";

export const Navbar = () => {
  const location = useLocation();

  const navItems = (Object.keys(PAGE_MAP) as TPageKey[])
    .filter((key) => {
      // 這裡 info 會精確推導為 IPageInfo
      const info: IPageInfo = PAGE_MAP[key];
      return !info.hidden;
    })
    .map((key) => ({
      key,
      path: key === "index" ? "/" : `/${key}/`,
      label: PAGE_MAP[key].label,
    }));

  const currentPath = location.pathname.replace(/\/+$/, "") || "/";

  return (
    <nav className="flex items-center gap-6 p-4 border-b bg-white shadow-sm">
      <div className="text-xl font-black text-blue-600">DEMO</div>
      <div className="flex gap-4">
        {navItems.map((item) => {
          const target = item.path.replace(/\/+$/, "") || "/";
          const isActive = currentPath === target;
          return (
            <Link
              key={item.key}
              to={item.path}
              className={`${isActive ? "text-blue-600 font-bold border-b-2 border-blue-600" : "text-gray-500"} hover:text-blue-500 transition-colors px-1 pb-1`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
