// src/pages/index/HomeView.tsx
import { Navbar } from '../../common/Navbar';

export const HomeView = () => {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[60vh] p-10">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-black text-gray-900 leading-tight">
            打造極致的 <span className="text-blue-600">MPA + CSR</span> 體驗
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            這是首頁大廳。你可以嘗試點擊導航列，觀察 Network 面板：
            你會發現 URL 變了，但 **沒有重新請求 HTML**。
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition">
              開始探索
            </button>
            <button className="px-8 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition">
              了解更多
            </button>
          </div>
        </div>
      </main>
    </>
  );
};
