import React, { useState, useCallback } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Cross1Icon, CheckIcon, SymbolIcon } from '@radix-ui/react-icons';
import type { IConfigGroup } from '../types';

interface IProps {
  initialValue: IConfigGroup[];
  onClose: () => void;
  onApply: (data: IConfigGroup[]) => void;
}

export const JsonConfigModal: React.FC<IProps> = ({ initialValue, onClose, onApply }) => {
  const [code, setCode] = useState<string>(JSON.stringify(initialValue, null, 2));
  const [isValid, setIsValid] = useState<boolean>(true);

  // 1. 設定 JSON Schema 確保用戶編輯安全
  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: true,
      schemas: [{
        uri: "https://ark-resource/config-schema.json",
        fileMatch: ["*"],
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              isEnabled: { type: "boolean" },
              listName: { type: "string" },
              materials: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    amount: { type: "number" }
                  }
                }
              }
            },
            required: ["id", "listName", "materials"]
          }
        }
      }]
    });
  }, []);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(code) as IConfigGroup[];
      if (!Array.isArray(parsed)) throw new Error("Must be an array");
      onApply(parsed);
      onClose();
    } catch (e) {
      setIsValid(false);
      alert("JSON 格式錯誤或不符合規範");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#1e1e1e] w-full max-w-4xl h-[80vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 bg-[#252526] border-b border-white/5">
          <div className="flex items-center gap-3">
            <SymbolIcon className="text-blue-400 animate-spin-slow" />
            <div>
              <h2 className="text-sm font-black text-white tracking-widest uppercase">高級配置編輯器</h2>
              <p className="text-[9px] text-slate-500 font-bold uppercase">JSONC Editor Mode</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <Cross1Icon />
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="json"
            value={code}
            theme="vs-dark"
            onMount={handleEditorMount}
            onChange={(val) => {
              setCode(val || "[]");
              setIsValid(true);
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "JetBrains Mono, Menlo, monospace",
              formatOnPaste: true,
              automaticLayout: true,
              padding: { top: 20 }
            }}
          />
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#252526] border-t border-white/5 flex justify-between items-center">
          <p className="text-[10px] text-slate-500 font-mono">
            {isValid ? "✓ 語法檢查通過" : "✗ JSON 格式無效"}
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              取消
            </button>
            <button 
              onClick={handleApply}
              className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-900/20 active:scale-95"
            >
              <CheckIcon /> 應用變更
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
