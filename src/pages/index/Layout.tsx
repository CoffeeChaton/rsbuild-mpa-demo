import { useLocation } from 'react-router-dom';
import { PAGE_MAP } from '../../common/config/pages';
import { useEffect } from 'react';

const MetaUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    // 移除開頭斜線並取得第一層路徑作為 Key
    const pathKey = location.pathname.split('/')[1] || 'index';
    const config = PAGE_MAP[pathKey] || PAGE_MAP.index;
    
    document.title = config.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc instanceof HTMLMetaElement) {
      metaDesc.content = config.description;
    }
    
    // 面試加分點：更新 Open Graph 標籤
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle instanceof HTMLMetaElement) ogTitle.content = config.title;
  }, [location]);

  return null;
};

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <MetaUpdater />
    {children}
  </>
);
