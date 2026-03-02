import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type TMapPreference, TILE_LAYERS } from '@/common/types/map';
import { loadMapPreference, saveMapPreference } from '@/common/utils/mapStorage';

// 修正 Leaflet 預設 Icon 在建置後遺失的問題
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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

    // 1. 初始化讀取
    const initialConfig = loadMapPreference();

    // 2. 建立實例
    const map = L.map(containerRef.current, {
      center: initialConfig.center,
      zoom: initialConfig.zoom,
      scrollWheelZoom: 'center',
      preferCanvas: true // 效能優化
    });

    mapInstance.current = map;

    // 3. 載入圖層
    L.tileLayer(TILE_LAYERS[initialConfig.tileLayer], {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 4. 監聽變動並自動儲存 (防禦性更新)
    const updatePref = () => {
      const center = map.getCenter();
      const newPref: TMapPreference = {
        center: [
          Number(center.lat.toFixed(6)), 
          Number(center.lng.toFixed(6))
        ],
        zoom: map.getZoom(),
        tileLayer: initialConfig.tileLayer // 這裡可擴充為動態切換
      };
      saveMapPreference(newPref);
    };

    map.on('moveend', updatePref);
    map.on('zoomend', updatePref);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '600px', backgroundColor: '#f0f0f0' }} 
    />
  );
};
