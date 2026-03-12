import { ChevronDownIcon, ChevronRightIcon, TrashIcon } from "@radix-ui/react-icons";
import type { IConfigGroup } from "../types";

interface IProps {
  group: IConfigGroup;
  materialMap: Record<string, string>;
  onUpdate: (g: IConfigGroup) => void;
  onDelete: () => void;
}

export function GroupRow({ group, materialMap, onUpdate, onDelete }: IProps) {
  const addMaterial = () => {
    const updated = { ...group, materials: [...group.materials, { name: "", amount: 1, itemNote: "" }] };
    onUpdate(updated);
  };

  return (
    <div className={`relative bg-white rounded-xl border border-slate-200 shadow-sm ${!group.isEnabled && "opacity-50"}`}>
      {/* 組標題與工具列 */}
      {/* 解決點不到問題 1：組刪除按鈕加大熱區並增加觸控反饋 */}
      <div className="p-4 flex items-center gap-3 border-b border-slate-50">
        <button onClick={() => onUpdate({ ...group, isCollapsed: !group.isCollapsed })} className="text-slate-400">
          {group.isCollapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
        </button>
        <input
          type="checkbox"
          checked={group.isEnabled}
          onChange={() => onUpdate({ ...group, isEnabled: !group.isEnabled })}
        />
        <input
          value={group.listName}
          onChange={(e) => onUpdate({ ...group, listName: e.target.value })}
          className="font-bold text-sm w-32 bg-transparent outline-none"
          placeholder="組標題"
        />
        <input
          value={group.description}
          onChange={(e) => onUpdate({ ...group, description: e.target.value })}
          className="text-xs text-slate-400 flex-1 bg-transparent outline-none"
          placeholder="一行說明..."
        />
        <button onClick={onDelete} className="text-slate-300 hover:text-rose-500">
          <TrashIcon />
        </button>
      </div>

      {/* 子項目配置 */}
      {!group.isCollapsed && (
        <div className="p-4 space-y-3">
          {group.materials.map((m, idx) => {
            const matKey = Object.keys(materialMap).find(k => materialMap[k] === m.name);
            return (
              <div key={idx} className="flex items-center gap-4">
                {/* 圖片 40x40, Hover 80x80 不影響佈局 (使用絕對定位) */}
                <div className="relative w-10 h-10 shrink-0">
                  <div className="absolute top-0 left-0 w-10 h-10 overflow-hidden z-10 hover:z-50 hover:w-30 hover:h-30 hover:shadow-xl transition-all">
                    {matKey
                      ? <img src={`${import.meta.env.BASE_URL}/img/game/item/${matKey}.png`} className="w-full h-full object-contain" alt="" />
                      : <div className="w-full h-full" />}
                  </div>
                </div>

                <input
                  list="m-list"
                  value={m.name}
                  onChange={(e) => {
                    const materials = [...group.materials];
                    materials[idx].name = e.target.value;
                    onUpdate({ ...group, materials });
                  }}
                  className="text-xs font-bold border-b w-32 outline-none focus:border-slate-900"
                />

                <input
                  type="number"
                  value={m.amount}
                  onChange={(e) => {
                    const materials = [...group.materials];
                    materials[idx].amount = Number(e.target.value);
                    onUpdate({ ...group, materials });
                  }}
                  className="w-12 text-sm font-mono text-orange-600 text-right bg-transparent outline-none"
                />

                <input
                  value={m.itemNote}
                  onChange={(e) => {
                    const materials = [...group.materials];
                    materials[idx].itemNote = e.target.value;
                    onUpdate({ ...group, materials });
                  }}
                  className="flex-1 text-[11px] text-slate-400 border-none italic focus:ring-0"
                  placeholder="列備註..."
                />

                <button
                  onClick={() => {
                    const materials = group.materials.filter((_, i) => i !== idx);
                    onUpdate({ ...group, materials });
                  }}
                  className="text-slate-200 hover:text-rose-500"
                >
                  <TrashIcon />
                </button>
              </div>
            );
          })}
          <button onClick={addMaterial} className="text-[12px] font-black text-slate-300 hover:text-blue-500">+ ADD SUB-ITEM</button>
        </div>
      )}

      <datalist id="m-list">
        {Object.values(materialMap).map(v => <option key={v} value={v} />)}
      </datalist>
    </div>
  );
}
