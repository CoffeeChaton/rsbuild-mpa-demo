import React, { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import { CopyIcon, RocketIcon, BackpackIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ITEM_DATA_KEY, itemFetcher } from '../game2/services/itemFetcher';
import plan_a from './assets/plan_a.tsv?raw';
import plan_b from './assets/plan_b.tsv?raw';

// --- Types ---
interface IRow { rare?: number; name?: string; count?: number; isHeader?: boolean; }

// --- 子組件 1：高級感複製按鈕 (帶微互動) ---
const CopyBtn = ({ content, className }: { content: string, className?: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button 
            variant="secondary" size="icon" 
            className={`h-7 w-7 transition-all duration-300 active:scale-75 ${copied ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white/90 hover:bg-white'} ${className}`}
            onClick={handleCopy}
        >
            {copied ? <CheckIcon className="w-4 h-4 animate-in zoom-in" /> : <CopyIcon className="w-4 h-4" />}
        </Button>
    );
};

// --- 子組件 2：統一的卡片容器 ---
const SectionCard = ({ children, badge, title, className = "" }: any) => (
    <section className={`flex-1 min-w-[380px] flex flex-col gap-5 p-6 rounded-[2.5rem] border border-white/50 bg-white/40 backdrop-blur-xl shadow-xl shadow-indigo-100/20 ${className}`}>
        <div className="flex items-center gap-2 px-2">
            <Badge className="bg-indigo-500/80 backdrop-blur-sm">{badge}</Badge>
            <h3 className="text-sm font-black italic text-indigo-900/70 uppercase tracking-tight">{title}</h3>
        </div>
        {children}
    </section>
);

// --- 子組件 3：Grid 表格預覽 ---
const DataGridPreview = ({ title, rawContent, rows }: { title: string, rawContent: string, rows: IRow[] }) => (
    <div className="flex flex-col gap-2 flex-1 min-h-[250px] overflow-hidden">
        <span className="text-[10px] font-black text-indigo-400/80 px-2 uppercase tracking-widest">{title}</span>
        <div className="relative group flex-1 border border-indigo-100/50 rounded-2xl bg-white/80 overflow-hidden flex flex-col">
            <CopyBtn content={rawContent} className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <div className="grid grid-cols-[80px_1fr_60px] bg-indigo-50/50 border-b border-indigo-50 px-4 py-2 text-[10px] font-black text-indigo-900 uppercase italic">
                <div>稀有度</div><div>名稱</div><div className="text-right">數量</div>
            </div>
            <div className="flex-1 overflow-y-scroll custom-scrollbar-always pr-1">
                {rows.map((row, idx) => row.isHeader ? (
                    <div key={idx} className="bg-slate-50/50 px-4 py-1 text-[9px] font-bold text-slate-400 border-b border-slate-100">稀有度 {row.rare}</div>
                ) : (
                    <div key={idx} className="grid grid-cols-[80px_1fr_60px] px-4 py-2 text-[11px] border-b border-slate-50 hover:bg-white transition-colors items-center">
                        <div className="text-slate-300 font-mono text-[8px]">● ● ●</div>
                        <div className="text-slate-700 font-medium truncate pr-2">{row.name}</div>
                        <div className="text-right font-mono font-bold text-indigo-600">{row.count}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export function FutureMaterialPage() {
    const { data: bundle } = useSWR(ITEM_DATA_KEY, itemFetcher);
    
    // --- 狀態管理：加入 LocalStorage 緩存 ---
    const [areaAJson, setAreaAJson] = useState(() => localStorage.getItem('fm_area_a') || '{"30013": 5}');
    const [areaBCache, setAreaBCache] = useState(() => localStorage.getItem('fm_area_b') || plan_a);

    useEffect(() => {
        localStorage.setItem('fm_area_a', areaAJson);
        localStorage.setItem('fm_area_b', areaBCache);
    }, [areaAJson, areaBCache]);

    const TEXTAREA_STYLE = "w-full h-[200px] p-4 rounded-2xl border border-indigo-100/50 bg-white/60 text-slate-700 font-mono text-xs outline-none focus:ring-4 ring-indigo-500/5 transition-all resize-none shadow-inner custom-scrollbar";

    // --- 核心邏輯 (簡化) ---
    const getMapAndRows = (source: string, type: 'json' | 'tsv') => {
        const map = new Map<string, number>();
        if (type === 'json') {
            try { Object.entries(JSON.parse(source)).forEach(([k, v]) => map.set(k, v as number)); } catch { }
        } else {
            source.trim().split('\n').forEach(line => {
                const cols = line.split('\t');
                if (cols.length < 4) return;
                const id = bundle?.nameToIdMap.get(cols[2]?.trim()) || cols[2]?.trim();
                if (id) map.set(id, (map.get(id) || 0) + (parseInt(cols[3]) || 0));
            });
        }
        
        const rows: IRow[] = [];
        const groups: any = { 5: [], 4: [], 3: [], 2: [], 1: [], 0: [] };
        map.forEach((count, id) => bundle?.items[id] && groups[bundle.items[id].rare].push({ name: bundle.items[id].name.tw, count }));
        [5, 4, 3, 2, 1, 0].forEach(rare => {
            if (groups[rare].length) {
                rows.push({ rare, isHeader: true });
                groups[rare].forEach((item: any) => rows.push(item));
            }
        });
        return { map, rows };
    };

    const dataA = useMemo(() => getMapAndRows(areaAJson, 'json'), [areaAJson, bundle]);
    const dataB = useMemo(() => getMapAndRows(areaBCache, 'tsv'), [areaBCache, bundle]);

    const mapCombined = useMemo(() => {
        const combined = new Map(dataA.map);
        dataB.map.forEach((v, k) => combined.set(k, (combined.get(k) || 0) + v));
        return combined;
    }, [dataA.map, dataB.map]);

    const finalTsv = useMemo(() => {
        let lines = ["稀有度\t名稱\t數量"];
        const combinedData = getMapAndRows("", "json"); // 借用結構
        // 此處簡化處理，實際複製時直接抓取 combined 的狀態
        return Array.from(mapCombined).map(([id, count]) => `${bundle?.items[id]?.rare}\t${bundle?.items[id]?.name.tw}\t${count}`).join('\n');
    }, [mapCombined, bundle]);

    const combinedJson = useMemo(() => {
        const obj: any = {};
        mapCombined.forEach((v, k) => { if (bundle?.items[k]) obj[k] = v; });
        return JSON.stringify(obj, null, 2);
    }, [mapCombined, bundle]);

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-[#f5f3ff] via-[#fafafa] to-[#fdf2f8] flex flex-col lg:flex-row gap-6 overflow-x-hidden">
            
            <SectionCard badge="AREA A" title="MAA Import (JSON)">
                <textarea className={TEXTAREA_STYLE} value={areaAJson} onChange={(e) => setAreaAJson(e.target.value)} />
                <DataGridPreview title="Asset Analysis" rawContent={finalTsv} rows={dataA.rows} />
            </SectionCard>

            <SectionCard badge="AREA B" title="PLAN_CACHE (TSV)">
                <div className="flex gap-2">
                    <Button variant="secondary" className="h-7 text-[10px] font-bold rounded-full px-4 bg-white/60" onClick={() => setAreaBCache(plan_a)}><RocketIcon className="mr-1" /> PLAN_A</Button>
                    <Button variant="secondary" className="h-7 text-[10px] font-bold rounded-full px-4 bg-white/60" onClick={() => setAreaBCache(plan_b)}><RocketIcon className="mr-1" /> PLAN_B</Button>
                </div>
                <textarea className={TEXTAREA_STYLE} value={areaBCache} onChange={(e) => setAreaBCache(e.target.value)} />
                <DataGridPreview title="Requirement Details" rawContent={finalTsv} rows={dataB.rows} />
            </SectionCard>

            <SectionCard badge="AREA C" title="MAA Export" className="bg-indigo-600/5 border-indigo-200/50">
                <div className="flex-1 flex flex-col gap-6">
                    <div className="h-45 relative group border border-indigo-100/50 rounded-2xl bg-white/80 overflow-hidden">
                        <Badge className="absolute top-2 left-2 z-10 bg-indigo-500/80 text-[8px]">VALIDATED_JSON</Badge>
                        <CopyBtn content={combinedJson} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <pre className="w-full h-full p-6 pt-10 text-[11px] font-mono text-indigo-600 overflow-auto custom-scrollbar">{combinedJson}</pre>
                    </div>
                    <DataGridPreview title="Combined Summary" rawContent={finalTsv} rows={getMapAndRows(combinedJson, 'json').rows} />
                </div>
                <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black italic rounded-2xl h-14 shadow-lg shadow-indigo-200 transition-all hover:scale-[1.01] active:scale-95"
                    onClick={() => { navigator.clipboard.writeText(combinedJson); }}
                >
                    <BackpackIcon className="mr-2 w-5 h-5" /> COPY FINAL JSON
                </Button>
            </SectionCard>
        </div>
    );
}
