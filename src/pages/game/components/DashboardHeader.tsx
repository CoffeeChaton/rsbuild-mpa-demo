// components/DashboardHeader.tsx
import React from 'react';
import { AccountSwitcher } from './AccountSwitcher';
import type { IAccountProfile, TAccountId } from '../types';
import { SymbolIcon } from '@radix-ui/react-icons';

interface IDashboardHeaderProps {
  profiles: IAccountProfile[];
  activeId: TAccountId;
  currentAccount: IAccountProfile;
  onSelect: (id: TAccountId) => void;
  onAddAccount: (name: string) => void;
  onDeleteAccount: (id: TAccountId) => void;
  onUpdateAccount: (id: TAccountId, name: string, server: string) => void;
  onCopy: () => void;
  onImport: () => void;
}

export const DashboardHeader: React.FC<IDashboardHeaderProps> = (props) => (
  <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100/50 transition-all">
    <div className="space-y-1">
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">資源計畫器</h1>
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Active Server: <span className="text-blue-600">{props.currentAccount.server}</span>
        </p>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
      <AccountSwitcher
        profiles={props.profiles}
        currentId={props.activeId}
        onSelect={props.onSelect}
        onAdd={props.onAddAccount}
        onDelete={props.onDeleteAccount}
        onUpdate={props.onUpdateAccount}
      />

      <div className="h-6 w-px bg-slate-100 mx-1 hidden xl:block" />

      <div className="flex gap-2 flex-1 sm:flex-none">
        <button
          onClick={props.onCopy}
          className="flex-1 sm:flex-none px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <SymbolIcon className="w-3 h-3" /> 代碼化編輯 (JSON)
        </button>
      </div>
    </div>
  </header>
);
