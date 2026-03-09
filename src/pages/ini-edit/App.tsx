import React, { useState, useRef, useEffect, type ChangeEvent } from 'react';

// --- 類型與介面定義 ---
type TDiagType = 'error' | 'warning';

interface IDiagnostic {
  line: number;
  type: TDiagType;
  msg: string;
}

interface ISchema {
  [key: string]: string[];
}

interface IIniEditorProps {
  initialValue?: string;
  schema?: ISchema;
  docId?: string;
}

// --- 靜態配置 ---
const DEFAULT_SCHEMA: ISchema = {
  "Server": ["host", "port"],
  "Database": ["user", "password", "timeout"]
};

/**
 * @description 輕量級 INI 配置編輯器
 */
export const IniConfigurationEditor: React.FC<IIniEditorProps> = ({
  initialValue = '',
  schema = DEFAULT_SCHEMA,
  docId = 'DOC-DEFAULT'
}) => {
  const [code, setCode] = useState<string>(initialValue);
  const [diagnostics, setDiagnostics] = useState<IDiagnostic[]>([]);
  const [highlightHtml, setHighlightHtml] = useState<string>('');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLPreElement>(null);

  // XSS 預防
  const escapeHtml = (str: string): string => {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  // 核心解析邏輯
  const processValidation = (text: string) => {
    const lines = text.split('\n');
    const newDiagnostics: IDiagnostic[] = [];
    let currentSection: string | null = null;
    let htmlResult = '';

    lines.forEach((line, index) => {
      let lineHtml = '';
      const lineNum = index + 1;

      // 1. 註解
      if (/^\s*[;#]/.test(line)) {
        lineHtml = `<span class="text-gray-500">${escapeHtml(line)}</span>`;
      } 
      // 2. Section [Name]
      else if (line.match(/^(\s*)\[([^\]]+)\](.*)$/)) {
        const match = line.match(/^(\s*)\[([^\]]+)\](.*)$/)!;
        const [_, space, name, after] = match;
        currentSection = name;
        
        const isUnknown = !schema[name];
        if (isUnknown) {
          newDiagnostics.push({ line: lineNum, type: 'warning', msg: `[${docId}] 未定義的區塊: [${name}]` });
        }

        const nameStyle = isUnknown 
          ? 'text-yellow-400 underline decoration-wavy decoration-yellow-500 underline-offset-4' 
          : 'text-green-400 font-bold';
        
        lineHtml = `${escapeHtml(space)}<span class="${nameStyle}">[${escapeHtml(name)}]</span>${escapeHtml(after)}`;
      }
      // 3. Key=Value
      else if (line.match(/^(\s*)([^=]+?)(\s*=\s*)(.*)$/)) {
        const match = line.match(/^(\s*)([^=]+?)(\s*=\s*)(.*)$/)!;
        const [_, space, key, equals, rest] = match;
        const trimmedKey = key.trim();

        let keyStyle = 'text-blue-400';
        if (!currentSection) {
          newDiagnostics.push({ line: lineNum, type: 'error', msg: `[${docId}] 孤立屬性 '${trimmedKey}'` });
          keyStyle = 'text-red-400 underline decoration-wavy decoration-red-500 underline-offset-4';
        } else if (schema[currentSection] && !schema[currentSection].includes(trimmedKey)) {
          newDiagnostics.push({ line: lineNum, type: 'error', msg: `[${docId}] 區塊 [${currentSection}] 不支援 '${trimmedKey}'` });
          keyStyle = 'text-red-400 underline decoration-wavy decoration-red-500 underline-offset-4';
        }

        lineHtml = `${escapeHtml(space)}<span class="${keyStyle}">${escapeHtml(key)}</span><span class="text-gray-400">${escapeHtml(equals)}</span><span class="text-orange-300">${escapeHtml(rest)}</span>`;
      } 
      else {
        lineHtml = escapeHtml(line);
      }

      htmlResult += lineHtml + '\n';
    });

    setHighlightHtml(htmlResult + (text.endsWith('\n') ? ' ' : ''));
    setDiagnostics(newDiagnostics);
  };

  useEffect(() => {
    processValidation(code);
  }, [code, schema]);

  // 同步捲動
  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#121212] p-6 text-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-mono font-bold text-white">INI Editor <span className="text-sm font-normal text-gray-500">#{docId}</span></h2>
      </div>

      {/* 編輯器主體 */}
      <div className="relative h-[400px] w-full bg-[#1e1e1e] rounded-lg border border-gray-700 overflow-hidden font-mono text-[15px] leading-relaxed">
        {/* 背景渲染層 */}
        <pre
          ref={backdropRef}
          aria-hidden="true"
          className="absolute inset-0 p-4 m-0 pointer-events-none whitespace-pre overflow-auto z-10"
          dangerouslySetInnerHTML={{ __html: highlightHtml }}
        />
        
        {/* 輸入層 */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onScroll={handleScroll}
          spellCheck={false}
          className="absolute inset-0 p-4 m-0 w-full h-full bg-transparent text-transparent caret-white outline-none resize-none z-20 whitespace-pre overflow-auto selection:bg-white/10"
        />
      </div>

      {/* 診斷面板 */}
      <div className="mt-4 p-4 bg-black/30 rounded-md border border-gray-800">
        <div className="flex items-center mb-2">
          <span className={`px-2 py-0.5 rounded-full text-xs ${diagnostics.length > 0 ? 'bg-red-500' : 'bg-green-600'}`}>
            {diagnostics.length} Issues
          </span>
        </div>
        <ul className="space-y-1">
          {diagnostics.length === 0 ? (
            <li className="text-gray-500 text-sm italic">No issues found.</li>
          ) : (
            diagnostics.map((d, i) => (
              <li key={i} className={`text-xs font-mono ${d.type === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                <strong>L{d.line}:</strong> {d.msg}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
