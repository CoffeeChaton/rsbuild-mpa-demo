import { useState } from "react";
import type { TMapPreference } from "./types/MapPreference";
import { loadMapPreference, saveMapPreference } from "./utils/mapStorage";
import { MapViewer } from "./MapViewer";
import { TILE_LAYERS } from "./types/TILE_LAYERS";

export const MapEditView: React.FC = () => {
	const [pref, setPref] = useState<TMapPreference>(loadMapPreference());

	// 處理底圖切換
	const handleTileChange = (layer: TMapPreference["tileLayer"]): void => {
		const newPref = { ...pref, tileLayer: layer };
		setPref(newPref);
		saveMapPreference(newPref);
		// 提示：因為 MapViewer 內部會監聽 moveend，手動更新底圖後需重刷或透過狀態通知地圖
		window.location.reload();
	};

	return (
		<>
			<main className="p-8 max-w-6xl mx-auto">
				<header className="mb-8">
					<h1 className="text-3xl font-black">GIS 地圖編輯器</h1>
					<p className="text-gray-500">調整配置將自動同步至 LocalStorage</p>
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* 控制面板 */}
					<aside className="lg:col-span-1 space-y-6">
						<section className="p-4 bg-white border rounded-xl shadow-sm">
							<h3 className="font-bold mb-4 flex items-center gap-2">
								<span className="w-2 h-2 bg-blue-600 rounded-full"></span>
								底圖樣式
							</h3>
							<div className="space-y-2">
								{(Object.keys(TILE_LAYERS) as Array<TMapPreference["tileLayer"]>).map((key) => (
									<button
										key={key}
										onClick={() => handleTileChange(key)}
										className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
											pref.tileLayer === key
												? "bg-blue-600 text-white shadow-md"
												: "bg-gray-50 hover:bg-gray-100 text-gray-700"
										}`}
									>
										{key.toUpperCase()}
									</button>
								))}
							</div>
						</section>

						<section className="p-4 bg-gray-900 text-white rounded-xl shadow-inner text-xs font-mono">
							<h3 className="text-gray-400 mb-2 uppercase tracking-widest">Debug Info</h3>
							<p>LAT: {pref.center[0]}</p>
							<p>LNG: {pref.center[1]}</p>
							<p>ZOOM: {pref.zoom}</p>
						</section>
					</aside>

					{/* 地圖區域 */}
					<div className="lg:col-span-3 border-4 border-white rounded-2xl shadow-2xl overflow-hidden h-[600px]">
						<MapViewer />
					</div>
				</div>
			</main>
		</>
	);
};
