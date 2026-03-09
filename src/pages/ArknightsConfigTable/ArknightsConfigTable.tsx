import React, { useState, useMemo, useEffect } from 'react';
import { 
  DragHandleDots2Icon, PlusIcon, ImageIcon, 
  TrashIcon, CopyIcon, EnterIcon, ChevronDownIcon, ChevronRightIcon 
} from '@radix-ui/react-icons';

// --- Types & Interfaces ---
export type TResourceId = string;
export interface IMaterialEntry { id: TResourceId; name: string; amount: number; itemNote: string; }
export interface IConfigRow { 
  id: string; isEnabled: boolean; listName: string; displayName: string; 
  materials: IMaterialEntry[]; isCollapsed?: boolean; // 新增摺疊狀態
}
export interface IAccountProfile { id: string; accountName: string; configs: IConfigRow[]; }

export function ModernResourceManager() {
  const [materialMap, setMaterialMap] = useState<Record<string, string>>({});
  const [profiles, setProfiles] = useState<IAccountProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('default');
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // 初始化與存檔 (邏輯保持穩定)
  useEffect(() => {
    fetch('/locales/tw/material.json').then(res => res.json()).then(setMaterialMap).catch(() => {});
    const saved = localStorage.getItem('MODERN_RESOURCE_DATA');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfiles(Array.isArray(parsed) ? parsed : [{ id: 'default', accountName: '預設存檔', configs: [] }]);
      } catch (e) { setProfiles([{ id: 'default', accountName: '預設存檔', configs: [] }]); }
    } else { setProfiles([{ id: 'default', accountName: '預設存檔', configs: [] }]); }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && profiles.length > 0) localStorage.setItem('MODERN_RESOURCE_DATA', JSON.stringify(profiles));
  }, [profiles, isLoaded]);

  const currentProfile = useMemo(() => profiles.find(p => p.id === activeProfileId) || profiles[0] || { id: 'tmp', configs: [] }, [profiles, activeProfileId]);
  const safeConfigs = currentProfile.configs || [];

  const updateConfigs = (newConfigs: IConfigRow[]) => {
    setProfiles(prev => prev.map(p => p.id === currentProfile.id ? { ...p, configs: newConfigs } : p));
  };

  const summary = useMemo(() => {
    const res: Record<string, number> = {};
    safeConfigs.filter(c => c.isEnabled).forEach(row => {
      (row.materials || []).forEach(m => {
        if (m.name) res[m.name] = (res[m.name] || 0) + (Number(m.amount) || 0);
      });
    });
    return res;
  }, [safeConfigs]);

  // --- 操作邏輯 ---
  const handleExportJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(safeConfigs, null, 2));
    alert("JSON 已複製");
  };

  const toggleCollapse = (id: string) => {
    updateConfigs(safeConfigs.map(c => c.id === id ? { ...c, isCollapsed: !c.isCollapsed } : c));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-3 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header: 修正 iPhone SE 擠壓問題 */}
        <header className="flex justify-between items-center gap-2 mb-6 md:mb-8">
          <h1 className="text-lg md:text-xl font-bold whitespace-nowrap">資源計畫器</h1>
          <div className="flex items-center gap-1.5 md:gap-2">
            <button onClick={handleExportJSON} className="flex items-center gap-1 px-2.5 py-2 bg-white rounded-lg shadow-sm border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              <CopyIcon className="w-3.5 h-3.5" /> <span className="hidden xs:inline">複製</span>
            </button>
            <div className="relative">
              <button onClick={() => setShowPresetMenu(!showPresetMenu)} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-[11px] font-bold shadow-md shadow-blue-100 active:scale-95 transition-all">
                <PlusIcon className="w-3.5 h-3.5" /> ADD
              </button>
              {showPresetMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl border border-slate-100 z-[100] py-1">
                  <button onClick={() => { updateConfigs([...safeConfigs, { id: crypto.randomUUID(), isEnabled: true, listName: '新計畫', displayName: '未命名', materials: [], isCollapsed: false }]); setShowPresetMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 text-blue-600 font-bold">
                    + 空白項目
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 列表內容 */}
        <div className="space-y-3">
          {safeConfigs.map((row) => (
            <div key={row.id} className={`bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all ${!row.isEnabled && 'opacity-50'}`}>
              
              {/* 計畫標題區: 整合摺疊與勾選 */}
              <div className="p-3 md:p-4 flex items-center gap-2 md:gap-3 bg-white">
                <button onClick={() => toggleCollapse(row.id)} className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400">
                  {row.isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                </button>
                <input 
                  type="checkbox" checked={row.isEnabled}
                  onChange={() => updateConfigs(safeConfigs.map(c => c.id === row.id ? {...c, isEnabled: !c.isEnabled} : c))}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600"
                />
                <input 
                  value={row.listName}
                  onChange={(e) => updateConfigs(safeConfigs.map(c => c.id === row.id ? {...c, listName: e.target.value} : c))}
                  className="text-sm font-bold bg-transparent border-none focus:ring-0 p-0 w-20 md:w-28"
                />
                <input 
                  value={row.displayName}
                  onChange={(e) => updateConfigs(safeConfigs.map(c => c.id === row.id ? {...c, displayName: e.target.value} : c))}
                  className="text-xs font-medium text-slate-400 bg-transparent border-none focus:ring-0 p-0 flex-1 truncate"
                />
                
                {/* 摺疊時顯示的小縮圖摘要 */}
                {row.isCollapsed && row.materials.length > 0 && (
                  <div className="hidden sm:flex items-center gap-1 px-2 border-l border-slate-100 ml-2">
                    {row.materials.slice(0, 3).map((m, i) => (
                      <div key={i} className="w-5 h-5 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-[8px] font-bold text-orange-600">
                        {m.amount}
                      </div>
                    ))}
                    {row.materials.length > 3 && <span className="text-[10px] text-slate-300">...</span>}
                  </div>
                )}

                <button 
                  onClick={() => updateConfigs(safeConfigs.filter(c => c.id !== row.id))} 
                  className="group/del p-2 text-slate-300 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="group-hover/del:text-rose-500 transition-colors" />
                </button>
              </div>

              {/* 摺疊內容區 */}
              {!row.isCollapsed && (
                <div className="px-4 pb-4 md:px-6 md:pb-5 pt-0 space-y-3 border-t border-slate-50/50">
                  <div className="h-2" /> {/* 間距補償 */}
                  {(row.materials || []).map((m, mIdx) => (
                    <div key={mIdx} className="group flex items-center gap-3 md:gap-4">
                      <div className="w-9 h-9 flex-shrink-0 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center relative">
                        {Object.keys(materialMap).find(k => materialMap[k] === m.name) ? (
                            <img src={`/img/game/${Object.keys(materialMap).find(k => materialMap[k] === m.name)}.png`} className="w-full h-full object-contain p-1" alt="" />
                        ) : <ImageIcon className="w-3.5 h-3.5 text-slate-200" />}
                      </div>

                      <div className="flex-1 flex items-center gap-2 md:gap-4">
                        <input 
                          list="material-list" value={m.name}
                          onChange={(e) => {
                            const next = [...safeConfigs];
                            next.find(c => c.id === row.id)!.materials[mIdx].name = e.target.value;
                            updateConfigs(next);
                          }}
                          className={`flex-1 text-xs font-semibold bg-transparent border-b border-transparent focus:border-slate-900 outline-none py-1 transition-all ${m.name && !Object.values(materialMap).includes(m.name) ? 'text-rose-600' : 'text-slate-700'}`}
                          placeholder="材料名稱"
                        />
                        <input 
                          type="number" value={m.amount}
                          onChange={(e) => {
                            const next = [...safeConfigs];
                            next.find(c => c.id === row.id)!.materials[mIdx].amount = Number(e.target.value);
                            updateConfigs(next);
                          }}
                          className="w-12 text-sm font-mono font-bold text-orange-600 bg-slate-50/50 rounded-md py-1 px-1.5 text-right outline-none focus:bg-orange-50"
                        />
                        <button 
                          onClick={() => {
                            const next = [...safeConfigs];
                            next.find(c => c.id === row.id)!.materials = next.find(c => c.id === row.id)!.materials.filter((_, i) => i !== mIdx);
                            updateConfigs(next);
                          }} 
                          className="group/itemdel p-1.5 text-slate-200 hover:bg-rose-50 rounded-md transition-all"
                        >
                          <TrashIcon className="group-hover/itemdel:text-rose-500 w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => {
                      const next = [...safeConfigs];
                      next.find(c => c.id === row.id)!.materials.push({ id: '', name: '', amount: 1, itemNote: '' });
                      updateConfigs(next);
                    }}
                    className="w-full py-2.5 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-black text-slate-300 hover:border-blue-200 hover:text-blue-400 transition-all flex items-center justify-center gap-1"
                  >
                    <PlusIcon className="w-3 h-3" /> ADD SUB-ITEM
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 底部摘要 - 改為更現代的 Card 排版 */}
        {Object.keys(summary).length > 0 && (
          <div className="mt-8 bg-slate-900 rounded-2xl md:rounded-[2rem] p-5 md:p-8 text-white shadow-2xl">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 text-center">追加小結摘要</h2>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 md:gap-6">
              {Object.entries(summary).map(([name, amount]) => (
                <div key={name} className="flex flex-col gap-0.5 border-l border-slate-800 pl-3">
                  <span className="text-[9px] font-bold text-slate-500 truncate uppercase">{name}</span>
                  <span className="text-base font-black text-blue-400">+{amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <datalist id="material-list">
          {Object.values(materialMap).map(v => <option key={v} value={v} />)}
        </datalist>
      </div>
    </div>
  );
}
