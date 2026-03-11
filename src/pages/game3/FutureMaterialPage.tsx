import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { CopyIcon, UpdateIcon, MagicWandIcon, RocketIcon, BackpackIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ITEM_DATA_KEY, itemFetcher } from '../game2/services/itemFetcher';

// 導入預設 TSV
import plan_a from './assets/plan_a.tsv?raw';
import plan_b from './assets/plan_b.tsv?raw';

// --- 提取子組件：統一的 TSV 預覽區塊 ---
const TsvPreview = ({ title, content }: { title: string, content: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-2 flex-1 min-h-[200px]">
            <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
            </div>
            <div className="relative group flex-1">
                {/* 複製按鈕：緊貼內容區右上角 */}
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm border bg-white/80 backdrop-blur"
                    onClick={handleCopy}
                >
                    {copied ? <CheckIcon className="text-green-600" /> : <CopyIcon />}
                </Button>

                <pre className="w-full h-full p-4 bg-slate-50 rounded-2xl border border-slate-200 overflow-auto custom-scrollbar font-mono text-[11px] leading-relaxed text-slate-600 whitespace-pre">
                    {content}
                </pre>
            </div>
        </div>
    );
};

export function FutureMaterialPage() {
    const { data: bundle } = useSWR(ITEM_DATA_KEY, itemFetcher);
    const [areaAJson, setAreaAJson] = useState<string>('{"30013": 5, "30063": 2}');
    const [areaBCache, setAreaBCache] = useState<string>(plan_a);

    // --- 樣式設定 ---
    const SECTION_CARD = "flex-1 min-w-[360px] flex flex-col gap-5 p-6 rounded-[2.5rem] border bg-white shadow-xl shadow-slate-200/40";
    const TEXTAREA_STYLE = "w-full min-h-[220px] p-4 rounded-2xl border-none bg-slate-50 text-slate-700 font-mono text-xs outline-none focus:ring-2 ring-indigo-500/20 transition-all resize-none shadow-inner custom-scrollbar";

    // --- 邏輯函數 ---
    const parseTsvToMap = (tsv: string) => {
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

    const formatToDisplayTsv = (dataMap: Map<string, number>) => {
        if (!bundle) return "Syncing Data...";
        let lines = [`${"稀有度".padEnd(8)}\t${"名稱".padEnd(12)}\t數量`]; // 增加基礎填充
        const groups: Record<number, { name: string, count: number }[]> = { 5: [], 4: [], 3: [], 2: [], 1: [], 0: [] };

        dataMap.forEach((count, id) => {
            const item = bundle.items[id];
            if (item) groups[item.rare].push({ name: item.name.tw, count });
        });

        [5, 4, 3, 2, 1, 0].forEach(rare => {
            if (groups[rare].length === 0) return;
            lines.push(`稀有度${rare}\t \t `);
            groups[rare].forEach(item => {
                lines.push(` \t${item.name.padEnd(14)}\t${item.count}`);
            });
        });
        return lines.join('\n');
    };

    const mapA = useMemo(() => {
        try { return new Map(Object.entries(JSON.parse(areaAJson))); }
        catch { return new Map<string, number>(); }
    }, [areaAJson]);

    const mapB = useMemo(() => parseTsvToMap(areaBCache), [areaBCache, bundle]);

    const combinedJson = useMemo(() => {
        if (!bundle) return "{}";
        const combined = new Map(mapA);
        mapB.forEach((val, key) => combined.set(key, (combined.get(key) || 0) + val));

        const filtered: Record<string, number> = {};
        const ignored: Record<string, number> = {};

        combined.forEach((val, key) => {
            if (bundle.items[key]) filtered[key] = val;
            else ignored[key] = val;
        });

        if (Object.keys(ignored).length > 0) console.warn("[FutureMaterial] Ignored keys:", ignored);
        return JSON.stringify(filtered, null, 2);
    }, [mapA, mapB, bundle]);

    const combinedTsv = useMemo(() => {
        const combined = new Map(mapA);
        mapB.forEach((val, key) => combined.set(key, (combined.get(key) || 0) + val));
        return formatToDisplayTsv(combined);
    }, [mapA, mapB, bundle]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 h-screen max-w-[1800px] mx-auto bg-[#f8fafc]">

            {/* A區：持有資產 */}
            <section className={SECTION_CARD}>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-indigo-200 text-indigo-600 bg-indigo-50">AREA A</Badge>
                    <h3 className="text-sm font-black italic">ASSET_INPUT</h3>
                </div>
                <textarea className={TEXTAREA_STYLE} value={areaAJson} onChange={(e) => setAreaAJson(e.target.value)} />
                <TsvPreview title="Analyzed Assets" content={formatToDisplayTsv(mapA)} />
            </section>

            {/* B區：需求規劃 */}
            <section className={`${SECTION_CARD} bg-slate-50/50`}>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-slate-300 text-slate-600 bg-white">AREA B</Badge>
                        <h3 className="text-sm font-black italic">PLAN_CACHE</h3>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" className="h-7 text-[10px] font-bold rounded-full px-4" onClick={() => setAreaBCache(plan_a)}>
                            <UpdateIcon className="mr-1" /> DEFAULT
                        </Button>
                        <Button variant="secondary" className="h-7 text-[10px] font-bold rounded-full px-4" onClick={() => setAreaBCache(plan_b)}>
                            <RocketIcon className="mr-1" /> PLAN_B
                        </Button>
                    </div>
                </div>
                <textarea className={`${TEXTAREA_STYLE} bg-white shadow-sm border border-slate-100 text-slate-600`} value={areaBCache} onChange={(e) => setAreaBCache(e.target.value)} />
                <TsvPreview title="Planned Requirements" content={formatToDisplayTsv(mapB)} />
            </section>

            {/* C區：未來視結算 */}
            <section className={`${SECTION_CARD} border-indigo-100 bg-indigo-50/20`}>
                <div className="flex justify-between items-center border-b border-indigo-100 pb-4">
                    <h2 className="text-xl font-black italic text-indigo-900 tracking-tighter uppercase">[未來視總結]</h2>
                    <MagicWandIcon className="text-indigo-400 w-6 h-6" />
                </div>

                <div className="flex-1 flex flex-col gap-6 overflow-hidden mt-2">
                    {/* JSON 輸出區 (同樣配備右上角複製) */}
                    <div className="h-1/3 relative group">
                        <div className="absolute top-2 left-2 z-10"><Badge className="bg-indigo-500 text-[8px] h-4">JSON_ID</Badge></div>
                        <Button
                            variant="secondary" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/80"
                            onClick={() => navigator.clipboard.writeText(combinedJson)}
                        >
                            <CopyIcon />
                        </Button>
                        <pre className="w-full h-full p-6 pt-10 bg-white rounded-2xl border border-indigo-100 text-[11px] font-mono text-indigo-600 overflow-auto custom-scrollbar">
                            {combinedJson}
                        </pre>
                    </div>

                    <TsvPreview title="Final Combined TSV" content={combinedTsv} />
                </div>

                <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black italic rounded-2xl h-14 shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
                    onClick={() => navigator.clipboard.writeText(combinedTsv)}
                >
                    <BackpackIcon className="mr-2 w-5 h-5" /> ONE-CLICK EXPORT TSV
                </Button>
            </section>
        </div>
    );
}
