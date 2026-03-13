// src/pages/game2/DataEditorPage.tsx
import { type ClipboardEvent, useMemo, useState } from "react";
import useSWR from "swr";
import {
  CopyIcon,
  StarFilledIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { ITEM_DATA_KEY, itemFetcher } from "./services/itemFetcher";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import type { TRows } from "./type"; //

export function DataEditorPage() {
  const { data: bundle, error } = useSWR(ITEM_DATA_KEY, itemFetcher);
  const [rows, setRows] = useState<TRows[]>([]);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const handlePaste = (e: ClipboardEvent) => {
    const text = e.clipboardData.getData("text");
    if (!text.includes("\t")) return;
    const newRows: TRows[] = text.split("\n").filter(line => line.trim()).map((line) => {
      const [, activity, product, amount] = line.split("\t");
      return {
        id: crypto.randomUUID(),
        status: "X",
        activity: activity?.trim() || "",
        product: product?.trim() || "",
        amount: parseInt(amount?.trim()) || 0,
      };
    });
    setRows(newRows);
  };

  const displayData = useMemo(() => {
    if (!bundle) return rows.map(r => ({ ...r, isValid: false, matchedItem: null }));
    return rows.map(row => {
      const matchedId = bundle.items[row.product] ? row.product : bundle.nameToIdMap.get(row.product);
      const matchedItem = matchedId ? bundle.items[matchedId] : null;
      return { ...row, status: matchedItem ? "O" : "X", isValid: !!matchedItem, matchedItem, matchedId };
    });
  }, [rows, bundle]);

  // 結算數據分組
  const settlementGroups = useMemo(() => {
    const groups: Record<number, { name: string, total: number, id: string }[]> = {
      5: [],
      4: [],
      3: [],
      2: [],
      1: [],
      0: [],
    };
    displayData.forEach(row => {
      if (row.isValid && row.matchedItem && row.matchedId) {
        const rare = row.matchedItem.rare;
        const existing = groups[rare].find(i => i.id === row.matchedId);
        if (existing) existing.total += row.amount;
        else groups[rare].push({ name: row.matchedItem.name.tw, total: row.amount, id: row.matchedId });
      }
    });
    return groups;
  }, [displayData]);

  // 生成結算 TSV 字串
  const settlementTsv = useMemo(() => {
    const lines = ["稀有度\t名稱\t數量"];
    [5, 4, 3, 2, 1, 0].forEach(rare => {
      const items = settlementGroups[rare];
      if (items.length === 0) return;
      items.forEach((item, index) => {
        const rareLabel = index === 0 ? `稀有度${rare}` : ""; // 僅首行顯示稀有度
        lines.push(`${rareLabel}\t${item.name}\t${item.total}`);
      });
    });
    return lines.join("\n");
  }, [settlementGroups]);

  if (error) return <div className="p-10 text-red-500 font-bold text-center underline italic tracking-tighter">DATA_FETCH_FAILED</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12 pb-40">
      {/* 圖片 Overlay 遮罩 */}
      {previewImg && (
        <div
          className="fixed inset-0 z-[999] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center cursor-zoom-out"
          onClick={() => setPreviewImg(null)}
        >
          <div className="bg-white p-4 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200">
            <img
              src={previewImg}
              className="w-[183px] h-[183px] object-contain"
              alt="Preview"
            />
            <p className="text-center text-[10px] font-black text-slate-400 mt-2 tracking-widest uppercase">Tap to close</p>
          </div>
        </div>
      )}

      <datalist id="item-options">
        {bundle?.options.map(opt => <option key={opt.value} value={opt.label} />)}
      </datalist>

      {/* --- 標題與表格 --- */}
      <header className="flex justify-between items-center">
        <h1 className="text-4xl font-black tracking-tighter italic">GRID ANALYZER</h1>
        <Button className="bg-slate-900 rounded-2xl" onClick={() => navigator.clipboard.writeText(settlementTsv)}>
          <CopyIcon className="mr-2" /> QUICK EXPORT
        </Button>
      </header>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden min-h-[160px]">
        {rows.length === 0
          ? (
            <div onPaste={handlePaste} className="h-64 flex flex-col items-center justify-center bg-slate-50/20 cursor-crosshair">
              <p className="text-xs font-black text-slate-300 tracking-[0.5em] uppercase animate-pulse">Paste Data Here</p>
            </div>
          )
          : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-20 text-center font-black text-[10px]">AUTO</TableHead>
                  <TableHead className="font-black text-[10px]">PRODUCT</TableHead>
                  <TableHead className="w-32 text-right font-black text-[10px]">QTY</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-center">
                      <div className={`mx-auto w-8 py-0.5 rounded text-[9px] font-black ${row.status === "O" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-300"}`}>
                        {row.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      <input
                        list="item-options"
                        className="bg-transparent outline-none text-xs font-black w-full"
                        value={row.product}
                        onChange={e => {
                          const newRows = [...rows];
                          newRows[idx].product = e.target.value.trim();
                          setRows(newRows);
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <input
                        type="number"
                        className="w-full bg-transparent text-right font-mono text-xs font-black text-blue-600 outline-none"
                        value={row.amount}
                        onChange={e => {
                          const newRows = [...rows];
                          newRows[idx].amount = parseInt(e.target.value) || 0;
                          setRows(newRows);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-slate-200" onClick={() => setRows(rows.filter((_, i) => i !== idx))}>
                        <TrashIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
      </div>

      {/* --- 結算手風琴 (自然展開) --- */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black italic border-b-2 border-slate-900 pb-2">SETTLEMENT</h2>
        <Accordion type="multiple" defaultValue={["5", "4", "3", "2", "1", "0"]} className="space-y-4">
          {[5, 4, 3, 2, 1, 0].map(rare => (
            <AccordionItem key={rare} value={rare.toString()} className="border-none bg-white rounded-[2rem] shadow-md px-2 overflow-visible">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: rare }).map((_, i) => <StarFilledIcon key={i} className="w-3 h-3 text-yellow-400" />)}
                    {rare === 0 && <span className="text-[10px] font-black text-slate-300">NORMAL</span>}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Tier {rare} ({settlementGroups[rare].length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 h-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {settlementGroups[rare].map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 rounded-2xl border border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-all"
                      onClick={() => setPreviewImg(`${import.meta.env.BASE_URL}/img/game/item/${item.id}.png`)}
                    >
                      <img src={`${import.meta.env.BASE_URL}/img/game/item/${item.id}.png`} className="w-10 h-10 object-contain rounded-lg border bg-white" alt={item.name} />
                      <div className="min-w-0">
                        <div className="text-[10px] font-black text-slate-300 uppercase">ID: {item.id}</div>
                        <div className="text-xs font-black text-slate-700 truncate">{item.name}</div>
                        <div className="text-sm font-mono font-black text-blue-600">x{item.total.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* --- TSV 純文本輸出區 --- */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">TSV Raw Data</h2>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg h-7 text-[10px] font-black border-2 border-slate-200 hover:bg-slate-900 hover:text-white transition-all"
            onClick={() => {
              navigator.clipboard.writeText(settlementTsv);
              // 這裡可以加一個簡單的 Feedback
            }}
          >
            <CopyIcon className="mr-2 w-3 h-3" /> COPY TSV
          </Button>
        </div>
        <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl">
          <pre className="text-slate-300 font-mono text-xs leading-relaxed whitespace-pre overflow-x-auto custom-scrollbar">
            {settlementTsv}
          </pre>
        </div>
      </section>
    </div>
  );
}
