import { type FC, useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import { CheckIcon, Cross1Icon, SymbolIcon } from "@radix-ui/react-icons";
import type { IConfigGroup } from "../types";

// 根據 materialMap 動態產出 Schema
const getDynamicSchema = (materialMap: Record<string, string>) => {
  const materialNames = Object.values(materialMap);

  return {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        isEnabled: { type: "boolean" },
        listName: { type: "string", description: "組項目的名稱" },
        description: { type: "string" },
        materials: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "材料名稱",
                // 關鍵：動態注入材料清單作為補全選項
                enum: materialNames.length > 0 ? materialNames : undefined,
              },
              amount: {
                type: "number",
                minimum: 1, // 限制必須 > 0 (即至少為 1)
                description: "材料數量",
              },
              itemNote: { type: "string" },
            },
            required: ["name", "amount"],
          },
        },
      },
      required: ["id", "listName", "materials"],
    },
  };
};

interface IProps {
  initialValue: IConfigGroup[];
  materialMap: Record<string, string>; // 新增傳入地圖
  onClose: () => void;
  onApply: (data: IConfigGroup[]) => void;
}

export const JsonConfigModal: FC<IProps> = ({
  initialValue,
  materialMap,
  onClose,
  onApply,
}) => {
  const [code, setCode] = useState<string>(JSON.stringify(initialValue, null, 2));
  const [validationErrors, setValidationErrors] = useState<monaco.editor.IMarker[]>([]);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monaco | null>(null);

  const handleEditorMount: OnMount = (editor, monacoInstance: typeof monaco) => {
    editorRef.current = editor;
    monacoRef.current = monacoInstance;

    // 根據 MS 範例修正：直接透過 monacoInstance.languages.json 配置
    // 這裡使用 monacoInstance 確保使用的是當前編輯器實體
    monacoInstance.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      schemas: [{
        uri: "https://TODO/ark-resource/strict-schema.json", // TODO
        fileMatch: ["*"], // 關聯所有開啟的 json model
        schema: getDynamicSchema(materialMap),
      }],
    });

    // 設定初次掛載時的格式化 (Optional)
    setTimeout(() => {
      editor.getAction("editor.action.formatDocument")?.run();
    }, 150);

    // 監聽 Marker 變化：這包含語法錯誤 (Syntax) 與 Schema 錯誤
    // 使用 editor.onDidChangeModelContent 配合一個小延遲通常更穩健
    // 但 MS 推薦的做法是直接觀察 markers
    const updateMarkers = () => {
      const model = editor.getModel();
      if (model) {
        const markers = monacoInstance.editor.getModelMarkers({ resource: model.uri });
        // 過濾錯誤與警告，確保用戶必須修正這些問題
        const criticalErrors = markers.filter(m =>
          m.severity === monacoInstance.MarkerSeverity.Error
          || m.severity === monacoInstance.MarkerSeverity.Warning
        );
        setValidationErrors(criticalErrors);
      }
    };

    // 初始執行一次
    updateMarkers();

    // 監聽裝飾與內容變化來更新錯誤列表
    editor.onDidChangeModelDecorations(updateMarkers);
  };

  const validateAndApply = () => {
    // 1. 強制檢查是否有任何 Schema 或語法錯誤標記
    if (validationErrors.length > 0) {
      // 雖然按鈕 disabled 了，但作為防禦性編程保留
      return;
    }

    try {
      const parsed = JSON.parse(code);
      // 確保解析出來的是陣列（符合 IConfigGroup[]）
      if (!Array.isArray(parsed)) throw new Error("Root must be an array");

      onApply(parsed);
      onClose();
    } catch (e: unknown) {
      // 這裡處理 JSON.parse 失敗的極端情況
      console.error("JSON Parse Error:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1e1e1e] w-full max-w-4xl h-[80vh] rounded-4xl shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in zoom-in-95 duration-200">
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
        <div className="flex-1 relative overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="json"
            value={code}
            theme="vs-dark"
            onMount={handleEditorMount}
            onChange={(val) => setCode(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "JetBrains Mono, Menlo, monospace",
              formatOnPaste: true,
              automaticLayout: true,
              padding: { top: 20 },
            }}
          />
        </div>

        {/* Footer: 逐條羅列 Schema 錯誤 */}
        <div className="bg-[#252526] border-t border-white/5 flex flex-col">
          {validationErrors.length > 0 && (
            <div className="max-h-32 overflow-y-auto p-4 space-y-2 border-b border-rose-900/30 bg-rose-900/10 custom-scrollbar">
              {validationErrors.map((err, idx) => (
                <div
                  key={idx}
                  className="group flex items-start gap-3 text-[11px] cursor-pointer hover:bg-white/5 p-1 rounded transition-colors"
                  onClick={() => {
                    // 點擊錯誤直接跳轉到該行
                    editorRef.current?.revealLineInCenter(err.startLineNumber);
                    editorRef.current?.setPosition({ lineNumber: err.startLineNumber, column: err.startColumn });
                    editorRef.current?.focus();
                  }}
                >
                  <span className="bg-rose-600 text-white px-1.5 rounded font-black">L{err.startLineNumber}</span>
                  <span className="text-rose-200 font-medium">{err.message}</span>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <div className={`w-2 h-2 rounded-full ${validationErrors.length > 0 ? "bg-rose-500 animate-pulse" : "bg-green-500"}`} />
                <span className={validationErrors.length > 0 ? "text-rose-400" : "text-green-500"}>
                  {validationErrors.length > 0 ? `${validationErrors.length} ERRORS DETECTED` : "SCHEMA VALIDATED"}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-2 text-xs font-bold text-slate-400">取消</button>
              <button
                disabled={validationErrors.length > 0}
                onClick={validateAndApply}
                className={`flex items-center gap-2 px-8 py-2 rounded-xl text-xs font-black transition-all ${
                  validationErrors.length > 0
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 active:scale-95"
                }`}
              >
                <CheckIcon /> 應用配置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
