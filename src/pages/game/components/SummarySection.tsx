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
  const copyAsCSV = () => {
    const csv = "材料,數量\n" + Object.entries(summary).map(([k, v]) => `"${k}",${v}`).join("\n");
    navigator.clipboard.writeText(csv);
    alert("小結已複製為 CSV");
  };

  const copyAsJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(summary, null, 2))
    alert("小結已複製為 JSON");

  }

  return (
    <section className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">追加小節摘要</h2>
          <p className="text-[9px] text-blue-500 font-bold mt-0.5">MATERIAL RECAP</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyAsJSON}
            className="text-[9px] font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
          >
            COPY JSON
          </button>
          <button
            onClick={copyAsCSV}
            className="text-[9px] font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
          >
            COPY CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Object.entries(summary).map(([name, amt]) => {
          const matKey = Object.keys(materialMap).find(k => materialMap[k] === name);
          return (
            <div key={name} className="flex flex-col gap-2 bg-slate-50/50 border border-slate-100 p-3 rounded-2xl">
              {/* 圖片容器：40px -> 120px (w-30 約為 120px) */}
              <div className="relative w-10 h-10 group">
                <img
                  src={`/img/game/item/${matKey}.png`} // 假設路徑，請根據你的資料夾結構調整
                  alt={name}
                  className="absolute top-0 left-0 w-10 h-10 object-contain z-10 
                     transition-all duration-300 ease-in-out
                     group-hover:z-50 group-hover:w-30 group-hover:h-30 
                     group-hover:shadow-2xl group-hover:scale-110"
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 truncate tracking-tight">{name}</span>
                <span className="text-base font-black text-slate-800 leading-none">+{amt}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  );
};
