// ResourceManager.tsx
import { useState, useEffect, useMemo } from "react";
import { useAccountManager } from "./AccountLogic";
import { DashboardHeader } from "./components/DashboardHeader";
import { GroupRow } from "./components/GroupRow";
import { SummarySection } from "./components/SummarySection";
import { JsonConfigModal } from "./components/JsonConfigModal";

export function ResourceManager() {
  const account = useAccountManager();
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [materialMap, setMaterialMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/locales/tw/material.json')
      .then(res => res.json())
      .then(data => setMaterialMap(data as Record<string, string>))
      .catch(() => console.error("Failed to load material map"));
  }, []);

  const safeConfigs = useMemo(() => account.currentAccount.configs || [], [account.currentAccount]);

  const summary = useMemo(() => {
    const sum: Record<string, number> = {};
    safeConfigs.filter(g => g.isEnabled).forEach(group => {
      group.materials.forEach(m => {
        if (m.name) sum[m.name] = (sum[m.name] || 0) + (Number(m.amount) || 0);
      });
    });
    return sum;
  }, [safeConfigs]);

  const handleAddProject = () => {
    account.updateConfigs([...safeConfigs, {
      id: crypto.randomUUID(), isEnabled: true, isCollapsed: false,
      listName: '新組項目', description: '', materials: []
    }]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <DashboardHeader
          profiles={account.profiles}
          activeId={account.activeId}
          currentAccount={account.currentAccount}
          onSelect={account.setActiveId}
          onAddAccount={account.addAccount}
          onDeleteAccount={account.deleteAccount}
          onUpdateAccount={account.updateAccountInfo}
          onCopy={() => setIsEditorOpen(true)} // 點擊複製改成開啟編輯器
          onImport={() => setIsEditorOpen(true)} // 點擊填充也開啟編輯器
        />

        {/* 內容區塊 */}
        <main className="space-y-6 min-h-[40vh]" key={account.activeId}>
          {safeConfigs.map(group => (
            <GroupRow
              key={group.id}
              group={group}
              materialMap={materialMap}
              onUpdate={(updated) => account.updateConfigs(safeConfigs.map(g => g.id === group.id ? updated : g))}
              onDelete={() => account.updateConfigs(safeConfigs.filter(g => g.id !== group.id))}
            />
          ))}

          {safeConfigs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white/50 text-slate-400">
              <div className="p-4 bg-slate-100 rounded-full mb-4">📂</div>
              <p className="text-sm font-bold tracking-tight">當前帳號尚無計畫</p>
              <p className="text-[10px] uppercase font-black opacity-50 mt-1">Ready to create your first project?</p>
            </div>
          )}

          {/* 這裡是重點：按鈕挪到小節上方 */}
          <div className="pt-4 space-y-10">
            <button
              onClick={handleAddProject}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-4xl text-slate-400 font-bold hover:bg-white hover:border-blue-400 hover:text-blue-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span className="text-lg">+ ADD GROUP</span>
            </button>

            {/* 小節始終顯示，且在按鈕下方 */}
            <SummarySection summary={summary} materialMap={materialMap} />
          </div>
        </main>

        {/* 渲染 Modal */}
        {isEditorOpen && (
          <JsonConfigModal
            initialValue={safeConfigs} // 這裡傳入的是當前 HTML 畫面最新的 state
            materialMap={materialMap}
            onClose={() => setIsEditorOpen(false)}
            onApply={(newData) => account.updateConfigs(newData)}
          />
        )}
      </div>
    </div>
  );
}
