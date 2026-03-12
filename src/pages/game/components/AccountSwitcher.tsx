import React, { useState } from "react";
import { CheckIcon, ChevronDownIcon, GearIcon } from "@radix-ui/react-icons";
import type { IAccountProfile, TAccountId } from "../types";
import { AccountManagerModal } from "./AccountManagerModal";

/**
 * @interface IAccountSwitcherProps
 * @description 標頭多帳號切換器組件介面
 */
interface IAccountSwitcherProps {
  profiles: IAccountProfile[];
  currentId: TAccountId;
  onSelect: (id: TAccountId) => void;
  onAdd: (name: string) => void;
  onDelete: (id: TAccountId) => void;
  onUpdate: (id: TAccountId, name: string, server: string) => void;
}

/**
 * @description 實現多帳號切換與齒輪管理入口
 * @requirement 支援下拉快速切換，窄螢幕適配
 */
export const AccountSwitcher: React.FC<IAccountSwitcherProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentAcc = props.profiles.find(p => p.id === props.currentId);

  return (
    <div className="relative flex items-center bg-blue-600 rounded-lg shadow-md">
      {/* 左側按鈕：加上 rounded-l-lg (左側圓角) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-3 py-1.5 text-white text-xs font-bold hover:bg-blue-700 transition-colors border-r border-blue-500/50 rounded-l-lg"
      >
        <span className="max-w-20 truncate">{currentAcc?.accountName || "切換帳號"}</span>
        <ChevronDownIcon className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* 右側：管理入口 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-2.5 py-1.5 text-white hover:bg-blue-700 transition-colors rounded-r-lg"
        title="帳號管理"
      >
        <GearIcon />
      </button>

      {/* 下拉列表 (簡易版 Dropdown) */}
      {isOpen && (
        <>
          {/* 全域遮罩，點擊關閉 */}
          <div className="fixed inset-0 z-60" onClick={() => setIsOpen(false)} />

          {/* 選單本體：確保 z-index 比遮罩高 */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl z-70 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-1 mb-1 border-b border-slate-50">
              <span className="text-[10px] font-black text-slate-400 uppercase">切換帳號</span>
            </div>
            {props.profiles.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  props.onSelect(p.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs hover:bg-blue-50 transition-colors font-bold text-slate-700"
              >
                {p.accountName}
                {p.id === props.currentId && <CheckIcon className="text-blue-600 w-4 h-4" />}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 帳號管理彈窗 */}
      {isModalOpen && (
        <AccountManagerModal
          {...props}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
