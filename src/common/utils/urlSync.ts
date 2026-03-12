import * as v from "valibot";
import { MapPreferenceSchema, type TMapPreference } from "../types/map";

/**
 * @description 初始化地圖狀態：URL 優先於儲存
 */
export const getInitialMapState = (savedPref: TMapPreference): TMapPreference => {
  const params = new URLSearchParams(window.location.search);

  // 如果網址沒座標，直接用傳入的 savedPref (來自 sessionStorage)
  if (!params.has("lat") || !params.has("lng")) return savedPref;

  const rawData = {
    center: [Number(params.get("lat")), Number(params.get("lng"))],
    zoom: params.has("z") ? Number(params.get("z")) : savedPref.zoom,
    tileLayer: params.get("l") || savedPref.tileLayer,
  };

  const result = v.safeParse(MapPreferenceSchema, rawData);
  return result.success ? result.output : savedPref;
};

/**
 * @description 核心同步：使用 replaceState 更新網址列
 */
export const syncStateToUrl = (pref: TMapPreference): void => {
  const params = new URLSearchParams(window.location.search);

  params.set("lat", pref.center[0].toFixed(6));
  params.set("lng", pref.center[1].toFixed(6));
  params.set("z", pref.zoom.toString());
  params.set("l", pref.tileLayer);

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", newUrl);
};
