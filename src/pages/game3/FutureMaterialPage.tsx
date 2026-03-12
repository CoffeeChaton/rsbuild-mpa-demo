import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { Flex } from "@radix-ui/themes";

import { ITEM_DATA_KEY, itemFetcher } from "../game2/services/itemFetcher";
import { ImportDialog } from "./components/ImportDialog";
import { EditorDialog } from "./components/EditorDialog";
import { TableArea } from "./components/TableArea";
import { ToolbarArea } from "./components/ToolbarArea";

const NAVBAR_HEIGHT = 70; // px
interface IItemRow {
  id: string;
  name: string;
  rare: number;
  stock: number;
  need: number;
  total: number;
}

interface IItemBundle {
  items: Record<string, { name: { tw: string }, rare: number }>;
  nameToIdMap: Map<string, string>;
}

function analyzeSource(content: string, bundle: unknown, isJson: boolean): Map<string, number> {
  const map = new Map<string, number>();
  if (!content || !bundle) return map;
  const typedBundle = bundle as IItemBundle;

  if (isJson) {
    try {
      const data = JSON.parse(content) as Record<string, number>;
      Object.entries(data).forEach(([k, v]) => map.set(k, v));
    } catch { /* ignore */ }
  } else {
    content.trim().split("\n").forEach(l => {
      const c = l.split("\t");
      if (c.length < 3) return;
      const id = typedBundle.nameToIdMap?.get(c[1]) || c[1];
      const val = parseInt(c[2]) || 0;
      map.set(id, (map.get(id) || 0) + val);
    });
  }
  return map;
}

export function FutureMaterialPage() {
  const { data: bundle } = useSWR(ITEM_DATA_KEY, itemFetcher);

  const [jsonA, setJsonA] = useState<string>(() => localStorage.getItem("fm_a_v5") || "{}");
  const [planName, setPlanName] = useState<string>(() => localStorage.getItem("fm_current_plan_name") || "plan_a");
  const [customPlans, setCustomPlans] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("fm_custom_plans");
    return saved ? JSON.parse(saved) : {};
  });

  const [tsvB, setTsvB] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [hideEmpty, setHideEmpty] = useState<boolean>(true);

  // Editor States
  const [editorOpen, setEditorOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null); // 舊 Key
  const [editTitle, setEditTitle] = useState(""); // 新名稱
  const [editContent, setEditContent] = useState("");

  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("fm_a_v5", jsonA);
  }, [jsonA]);
  useEffect(() => {
    localStorage.setItem("fm_custom_plans", JSON.stringify(customPlans));
  }, [customPlans]);
  useEffect(() => {
    localStorage.setItem("fm_current_plan_name", planName);
  }, [planName]);

  useEffect(() => {
    const fetchTsv = async () => {
      if (customPlans[planName] !== undefined) {
        setTsvB(customPlans[planName]);
      } else if (planName.startsWith("plan_")) {
        try {
          const m = await import(`./assets/${planName}.tsv?raw`);
          setTsvB(m.default);
        } catch {
          setTsvB("");
        }
      }
    };
    fetchTsv();
  }, [planName, customPlans]);

  const dataA = useMemo(() => analyzeSource(jsonA, bundle, true), [jsonA, bundle]);
  const dataB = useMemo(() => analyzeSource(tsvB, bundle, false), [tsvB, bundle]);

  const rows = useMemo<IItemRow[]>(() => {
    const b = bundle as IItemBundle | undefined;
    if (!b) return [];
    return Object.keys(b.items).map(id => {
      const stock = dataA.get(id) || 0;
      const need = dataB.get(id) || 0;
      return {
        id,
        name: b.items[id]?.name.tw || id,
        rare: b.items[id]?.rare || 0,
        stock,
        need,
        total: stock + need,
      };
    })
      .filter(r => {
        const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
        const hasData = r.stock !== 0 || r.need !== 0;
        return hideEmpty ? (matchSearch && hasData) : matchSearch;
      })
      .sort((a, b) => b.rare - a.rare || a.id.localeCompare(b.id));
  }, [dataA, dataB, bundle, search, hideEmpty]);

  const groupedRows = useMemo(() => {
    const groups: Record<number, IItemRow[]> = { 5: [], 4: [], 3: [], 2: [], 1: [] };
    rows.forEach(r => groups[r.rare]?.push(r));
    return groups;
  }, [rows]);

  const handleSavePlan = () => {
    const next = { ...customPlans };
    const title = editTitle.trim() || "未命名方案";

    // 如果是編輯舊有的，且名字改了，要刪除舊的 key
    if (editTargetId && editTargetId !== title) {
      delete next[editTargetId];
    }

    next[title] = editContent;
    setCustomPlans(next);
    setPlanName(title);
    setEditorOpen(false);
  };


  const loadDefaultToEditor = async (p: string) => {
    try {
      const m = await import(`./assets/${p}.tsv?raw`);
      setEditContent(m.default);
    } catch { /* ignore */ }
  };


  return (
    <Flex direction="column" height={`calc(100vh - ${NAVBAR_HEIGHT}px)`} className="bg-[#f2f4f7] overflow-hidden">
      {/* ToolbarArea */}
      <ToolbarArea
        search={search}
        setSearch={setSearch}
        rows={rows}
        hideEmpty={hideEmpty}
        setHideEmpty={setHideEmpty}
        planName={planName}
        setPlanName={setPlanName}
        customPlans={customPlans}
        setCustomPlans={setCustomPlans}
        setEditTargetId={setEditTargetId}
        setEditTitle={setEditTitle}
        setEditContent={setEditContent}
        setEditorOpen={setEditorOpen}
        tsvB={tsvB}
        setImportOpen={setImportOpen}
      />

      {/* TableArea */}
      <TableArea groupedRows={groupedRows} />

      {/* EditorDialog */}
      <EditorDialog
        editorOpen={editorOpen}
        setEditorOpen={setEditorOpen}
        loadDefaultToEditor={loadDefaultToEditor}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editContent={editContent}
        setEditContent={setEditContent}
        handleSavePlan={handleSavePlan}
      />

      {/* Import Dialog */}
      <ImportDialog
        importOpen={importOpen}
        setImportOpen={setImportOpen}
        jsonA={jsonA}
        setJsonA={setJsonA}
      />
    </Flex>
  );
}
