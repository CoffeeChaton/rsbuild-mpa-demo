import { CopyIcon, SymbolIcon } from '@radix-ui/react-icons';
import React from 'react';

/**
 * 需求：
 * 1. 顯示所有材料加總結果
 * 2. 提供 JSON 與 CSV 格式導出
 */
interface ISummaryProps {
  summary: Record<string, number>;
  materialMap: Record<string, string>
}

export const SummarySection: React.FC<ISummaryProps> = ({ summary, materialMap }) => {
  const copyAsExcelTSV = () => {
    // Excel 剪貼簿最愛的是 \t (Tab)
    const header = "材料\t數量\n";
    const rows = Object.entries(summary)
      .map(([k, v]) => `${k}\t${v}`) // 移除引號，直接用 Tab 分隔
      .join("\n");

    const tsv = header + rows;

    navigator.clipboard.writeText(tsv).then(() => {
      // 這裡建議用更現代的 Toast，但 alert 也是 Evil 你的風格
      alert("已複製 ");
    });
  };

  const copyAsJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(summary, null, 2))
    alert("已複製為 JSON");
  }

  return (
    <section className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm">
      {/* Header 區域：使用 items-center 與 justify-between */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 px-4 gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
            <SymbolIcon className="w-6 h-6 text-blue-500 animate-spin-slow" />
            材料清單小結
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Material Requirement Summary
          </p>
        </div>

        {/* 按鈕群組：靠右對齊 (flex-1 + justify-end) */}
        <div className="flex items-center gap-3 w-full sm:w-auto sm:justify-end">
          <button
            onClick={copyAsJSON}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-white border border-slate-200 
                     rounded-2xl text-xs font-black text-slate-600 shadow-sm hover:shadow-md 
                     transition-all active:scale-95 group/btn"
          >
            <CopyIcon className="group-hover/btn:text-blue-500 transition-colors" />
            JSON
          </button>
          <button
            onClick={copyAsExcelTSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-white border border-slate-200 
                     rounded-2xl text-xs font-black text-slate-600 shadow-sm hover:shadow-md 
                     transition-all active:scale-95 group/btn"
          >
            <CopyIcon className="group-hover/btn:text-blue-500 transition-colors" />
            EXCEL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Object.entries(summary).map(([name, amt]) => {
          const matKey = Object.keys(materialMap).find(k => materialMap[k] === name);

          return (
            <div
              key={name}
              className="group relative flex flex-col gap-4 p-5 
                   bg-white/60 backdrop-blur-xl 
                   border border-white/40 shadow-md
                   rounded-[2.5rem] transition-all duration-500
                   hover:bg-white/90 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* 圖片容器：提升基礎尺寸 */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                {/* 懸浮時的環境光：顏色稍微加深以應對更大的圖片 */}
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

                <img
                  src={`/img/game/item/${matKey}.png`}
                  alt={name}
                  // 基礎 w-20/h-20 (80px)，RWD 下自動調整
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-20 h-20 sm:w-24 sm:h-24 object-contain z-10 
                       transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                       group-hover:z-50 
                       /* 懸浮放大：手機端不宜過大以免出界，桌機端則盡情展示 */
                       group-hover:w-32 group-hover:h-32 
                       sm:group-hover:w-40 sm:group-hover:h-40
                       group-hover:drop-shadow-[0_25px_35px_rgba(0,0,0,0.3)]"
                />
              </div>

              <div className="flex flex-col gap-1 mt-2">
                {/* 名稱：字體加大至 text-sm/base */}
                <span className="text-sm sm:text-base font-bold text-slate-700 truncate text-center px-2">
                  {name}
                </span>
                {/* 數量：字體加大至 text-2xl，增加視覺衝擊力 */}
                <span className="text-2xl sm:text-3xl font-black text-blue-600 tabular-nums text-center leading-none">
                  +{amt}
                </span>
              </div>

              {/* 底部裝飾條：稍微加粗 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-0 group-hover:w-full transition-all duration-700 ease-out" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
