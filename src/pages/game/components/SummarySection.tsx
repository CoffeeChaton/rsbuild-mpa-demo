import React from 'react';

/**
 * 需求：
 * 1. 顯示所有材料加總結果
 * 2. 提供 JSON 與 CSV 格式導出
 */
interface ISummaryProps {
  summary: Record<string, number>;
}

export const SummarySection: React.FC<ISummaryProps> = ({ summary }) => {
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
        {Object.entries(summary).map(([name, amt]) => (
          <div key={name} className="flex flex-col gap-1 bg-slate-50/50 border border-slate-100 p-3 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 truncate">{name}</span>
            <span className="text-base font-black text-slate-800">+{amt}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
