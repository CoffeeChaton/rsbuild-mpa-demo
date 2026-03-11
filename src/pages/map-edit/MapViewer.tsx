import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
 

// 修正 Leaflet 預設 Icon 遺失問題
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { TILE_LAYERS, type TMapPreference } from '../../common/types/map';
import { loadMapPreference, saveMapPreference } from '../../common/utils/mapStorage';
import { getInitialMapState, syncStateToUrl } from '../../common/utils/urlSync';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export const MapViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapInstance.current) return;

    // 1. 初始化讀取：URL > SessionStorage
    const savedPref = loadMapPreference();
    const initialConfig = getInitialMapState(savedPref);

    // 2. 建立實例
    const map = L.map(containerRef.current, {
      center: initialConfig.center,
      zoom: initialConfig.zoom,
      scrollWheelZoom: 'center',
      preferCanvas: true
    });
    mapInstance.current = map;

    // 3. 載入圖層
    L.tileLayer(TILE_LAYERS[initialConfig.tileLayer], {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    /**
     * @description 獲取地圖當前快照
     */
    const getSnapshot = (): TMapPreference => {
      const center = map.getCenter();
      return {
        center: [
          Number(center.lat.toFixed(6)), 
          Number(center.lng.toFixed(6))
        ],
        zoom: map.getZoom(),
        tileLayer: initialConfig.tileLayer 
      };
    };

    /**
     * @description 靜默儲存 (SessionStorage)
     */
    const handleSilentSave = () => {
      saveMapPreference(getSnapshot());
    };

    /**
     * @description 懶惰同步 URL (模仿 TS Playground 聚焦/分享行為)
     */
    const handleUrlSync = () => {
      syncStateToUrl(getSnapshot());
    };

    // 4. 事件掛載
    // 操作地圖時「只存檔、不改網址」
    map.on('moveend', handleSilentSave);
    map.on('zoomend', handleSilentSave);

    // 觸發 URL 修改的明確點：
    // A. 視窗失去焦點 (User 點擊網址列或按 Ctrl+L 時)
    window.addEventListener('blur', handleUrlSync);
    // B. 頁面卸載前 (確保重新整理後的 URL 是最新的)
    window.addEventListener('beforeunload', handleUrlSync);

    return () => {
      window.removeEventListener('blur', handleUrlSync);
      window.removeEventListener('beforeunload', handleUrlSync);
      map.off('moveend', handleSilentSave);
      map.off('zoomend', handleSilentSave);
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[500px] bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200"
    />
  );
};
