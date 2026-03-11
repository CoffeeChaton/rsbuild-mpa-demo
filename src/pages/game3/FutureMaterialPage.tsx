import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { CopyIcon, RocketIcon, BackpackIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ITEM_DATA_KEY, itemFetcher } from '../game2/services/itemFetcher';

// 導入預設 TSV
import plan_a from './assets/plan_a.tsv?raw';
import plan_b from './assets/plan_b.tsv?raw';

// --- 定義資料結構 ---
interface IRow {
    rare?: number;
    name?: string;
    count?: number;
    isHeader?: boolean;
}

// --- 提取子組件：Grid 表格預覽 ---
const DataGridPreview = ({ title, rawContent, rows }: { title: string, rawContent: string, rows: IRow[] }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(rawContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-2 flex-1 min-h-62.5 overflow-hidden">
            <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{title}</span>
            </div>
            <div className="relative group flex-1 border border-indigo-100 rounded-2xl bg-white overflow-hidden shadow-sm flex flex-col">
                {/* 複製按鈕 */}
                <Button
                    variant="secondary" size="icon"
                    className="absolute top-2 right-4 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm border bg-white/90 backdrop-blur"
                    onClick={handleCopy}
                >
                    {copied ? <CheckIcon className="text-green-600" /> : <CopyIcon />}
                </Button>

                {/* Table Header */}
                <div className="grid grid-cols-[80px_1fr_60px] bg-indigo-50/50 border-b border-indigo-50 px-4 py-2 text-[10px] font-black text-indigo-900 uppercase italic">
                    <div>稀有度</div>
                    <div>名稱</div>
                    <div className="text-right">數量</div>
                </div>

                {/* Scrollable Body - 常態顯示滾動條 */}
                <div className="flex-1 overflow-y-scroll custom-scrollbar-always pr-1">
                    {rows.map((row, idx) => (
                        row.isHeader ? (
                            <div key={idx} className="grid grid-cols-1 bg-slate-50 px-4 py-1 text-[9px] font-bold text-slate-400 border-b border-slate-100">
                                稀有度 {row.rare}
                            </div>
                        ) : (
                            <div key={idx} className="grid grid-cols-[80px_1fr_60px] px-4 py-2 text-[11px] border-b border-slate-50 hover:bg-indigo-50/30 transition-colors items-center">
                                <div className="text-slate-300 font-mono">---</div>
                                <div className="text-slate-700 font-medium truncate pr-2">{row.name}</div>
                                <div className="text-right font-mono font-bold text-indigo-600">{row.count}</div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export function FutureMaterialPage() {
    const { data: bundle } = useSWR(ITEM_DATA_KEY, itemFetcher);
    const [areaAJson, setAreaAJson] = useState<string>('{"30013": 5, "30063": 2}');
    const [areaBCache, setAreaBCache] = useState<string>(plan_a);

    // --- 樣式設定 (統一風格) ---
    const SECTION_CARD = "flex-1 min-w-[380px] flex flex-col gap-5 p-6 rounded-[2.5rem] border border-indigo-100 bg-indigo-50/20 shadow-xl shadow-indigo-100/20";
    const TEXTAREA_STYLE = "w-full h-[200px] p-4 rounded-2xl border border-indigo-100/50 bg-white text-slate-700 font-mono text-xs outline-none focus:ring-2 ring-indigo-500/20 transition-all resize-none shadow-inner custom-scrollbar";

    // --- 邏輯：將 Map 轉為表格 Rows ---
    const getTableRows = (dataMap: Map<string, number>): IRow[] => {
        if (!bundle) return [];
        const results: IRow[] = [];
        const groups: Record<number, { name: string, count: number }[]> = { 5: [], 4: [], 3: [], 2: [], 1: [], 0: [] };

        dataMap.forEach((count, id) => {
            const item = bundle.items[id];
            if (item) groups[item.rare].push({ name: item.name.tw, count });
        });

        [5, 4, 3, 2, 1, 0].forEach(rare => {
            if (groups[rare].length === 0) return;
            results.push({ rare, isHeader: true });
            groups[rare].forEach(item => {
                results.push({ name: item.name, count: item.count });
            });
        });
        return results;
    };

    // --- 邏輯：將 Map 轉回原始 TSV (用於複製) ---
    const getRawTsv = (dataMap: Map<string, number>) => {
        if (!bundle) return "";
        const lines = ["稀有度\t名稱\t數量"];
        const rows = getTableRows(dataMap);
        rows.forEach(r => {
            if (r.isHeader) lines.push(`稀有度${r.rare}\t \t `);
            else lines.push(` \t${r.name}\t${r.count}`);
        });
        return lines.join('\n');
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const parseTsvToMap = (tsv: string): Map<string, number> => {
        const lines = tsv.trim().split('\n');
        const map = new Map<string, number>();
        lines.forEach(line => {
            const cols = line.split('\t');
            if (cols.length < 4) return;
            const productName = cols[2]?.trim();
            const amount = parseInt(cols[3]?.trim()) || 0;
            if (!productName || amount <= 0) return;
            const id = bundle?.nameToIdMap.get(productName) || productName;
            map.set(id, (map.get(id) || 0) + amount);
        });
        return map;
    };

    // --- Memo 計算區 ---
    const mapA = useMemo((): Map<string, number> => {
        try { return new Map(Object.entries(JSON.parse(areaAJson))); }
        catch { return new Map<string, number>(); }
    }, [areaAJson]);

    const mapB = useMemo(() => parseTsvToMap(areaBCache), [areaBCache, parseTsvToMap]);

    const mapCombined = useMemo(() => {
        const combined = new Map(mapA);
        mapB.forEach((val, key) => combined.set(key, (combined.get(key) || 0) + val));
        return combined;
    }, [mapA, mapB]);

    const combinedJson = useMemo(() => {
        if (!bundle) return "{}";
        const filtered: Record<string, number> = {};
        mapCombined.forEach((val, key) => {
            if (bundle.items[key]) filtered[key] = val;
        });
        return JSON.stringify(filtered, null, 2);
    }, [mapCombined, bundle]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 h-screen max-w-475 mx-auto bg-white">

            {/* A區：資產錄入 */}
            <section className={SECTION_CARD}>
                <div className="flex items-center gap-2 px-2">
                    <Badge className="bg-indigo-200">AREA A</Badge>
                    <h3 className="text-sm font-black italic text-indigo-900">MAA import</h3>
                </div>
                <textarea className={TEXTAREA_STYLE} value={areaAJson} onChange={(e) => setAreaAJson(e.target.value)} />
                <DataGridPreview title="Asset Analysis" rawContent={getRawTsv(mapA)} rows={getTableRows(mapA)} />
            </section>

            {/* B區：規劃快取 */}
            <section className={SECTION_CARD}>
                <div className="flex flex-col gap-4 px-2">
                    <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-300">AREA B</Badge>
                        <h3 className="text-sm font-black italic text-indigo-900">PLAN_CACHE</h3>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" className="h-7 text-[10px] font-bold rounded-full px-4 border border-indigo-100" onClick={() => setAreaBCache(plan_a)}>
                            <RocketIcon className="mr-1" /> PLAN_A
                        </Button>
                        <Button variant="secondary" className="h-7 text-[10px] font-bold rounded-full px-4 border border-indigo-100" onClick={() => setAreaBCache(plan_b)}>
                            <RocketIcon className="mr-1" /> PLAN_B
                        </Button>
                    </div>
                </div>
                <textarea className={TEXTAREA_STYLE} value={areaBCache} onChange={(e) => setAreaBCache(e.target.value)} />
                <DataGridPreview title="Requirement Details" rawContent={getRawTsv(mapB)} rows={getTableRows(mapB)} />
            </section>

            {/* C區：未來視總結 */}
            <section className={`${SECTION_CARD} bg-indigo-600/5 border-indigo-200`}>
                <div className="flex items-center gap-2">
                    <Badge className="bg-indigo-500">AREA C</Badge>
                    <h3 className="text-sm font-black italic text-indigo-900">MAA export</h3>
                </div>

                <div className="flex-1 flex flex-col gap-6 overflow-hidden mt-2">
                    {/* JSON 輸出區 */}
                    <div className="h-45 relative group">
                        <Badge className="absolute top-2 left-2 z-10 bg-indigo-500 text-[8px] h-4">VALIDATED_JSON</Badge>
                        <Button
                            variant="secondary" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90"
                            onClick={() => navigator.clipboard.writeText(combinedJson)}
                        >
                            <CopyIcon className="w-4 h-4" />
                        </Button>
                        <pre className="w-full h-full p-6 pt-10 bg-white rounded-2xl border border-indigo-200 text-[11px] font-mono text-indigo-600 overflow-auto custom-scrollbar">
                            {combinedJson}
                        </pre>
                    </div>

                    <DataGridPreview title="Combined Future Assets" rawContent={getRawTsv(mapCombined)} rows={getTableRows(mapCombined)} />
                </div>

                <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black italic rounded-2xl h-14 shadow-xl shadow-indigo-200 transition-all hover:scale-[1.01]"
                    onClick={() => navigator.clipboard.writeText(combinedJson)}
                >
                    <BackpackIcon className="mr-2 w-5 h-5" /> COPY JSON
                </Button>
            </section>
        </div>
    );
}
