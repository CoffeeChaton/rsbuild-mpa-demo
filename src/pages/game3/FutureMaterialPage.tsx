import React, { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import {
    Box, Flex, Card, Text, Button, TextField,
    Dialog, Table, Switch, DropdownMenu, IconButton, Separator
} from "@radix-ui/themes";
import {
    ClipboardIcon, BackpackIcon, MagnifyingGlassIcon,
    ChevronDownIcon, CopyIcon, TrashIcon, MagicWandIcon, GearIcon, PlusIcon
} from "@radix-ui/react-icons";

import { ITEM_DATA_KEY, itemFetcher } from "../game2/services/itemFetcher";

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

    useEffect(() => { localStorage.setItem("fm_a_v5", jsonA); }, [jsonA]);
    useEffect(() => { localStorage.setItem("fm_custom_plans", JSON.stringify(customPlans)); }, [customPlans]);
    useEffect(() => { localStorage.setItem("fm_current_plan_name", planName); }, [planName]);

    useEffect(() => {
        const fetchTsv = async () => {
            if (customPlans[planName] !== undefined) {
                setTsvB(customPlans[planName]);
            } else if (planName.startsWith("plan_")) {
                try {
                    const m = await import(`./assets/${planName}.tsv?raw`);
                    setTsvB(m.default);
                } catch { setTsvB(""); }
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
                stock, need, total: stock + need
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
        <Flex direction="column" height="100vh" className="bg-[#f2f4f7] overflow-hidden">
            {/* Toolbar Area */}
            <Box p="3" className="bg-white border-b shadow-sm z-20">
                <Flex direction="column" gap="3">
                    {/* 第一列：左上角核心操作 */}
                    <Flex align="center" gap="3">
                        <Flex gap="1" className="bg-slate-100 p-1 rounded-xl border border-slate-200">
                            <Button size="2" variant="ghost" color="indigo" onClick={() => setImportOpen(true)}>
                                <ClipboardIcon /> 導入原有
                            </Button>

                            <Separator orientation="vertical" />

                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <Button size="2" variant="ghost" color="gray" className="px-3 gap-2">
                                        <Text size="2" weight="bold" color="indigo">
                                            方案: {planName.replace("plan_", "").toUpperCase()}
                                        </Text>
                                        <ChevronDownIcon />
                                    </Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content variant="soft" color="indigo" className="min-w-[180px]">
                                    <DropdownMenu.Label>預設方案</DropdownMenu.Label>
                                    {["plan_a", "plan_b", "plan_c"].map(p => (
                                        <DropdownMenu.Item key={p} onClick={() => setPlanName(p)}>{p.toUpperCase()}</DropdownMenu.Item>
                                    ))}
                                    <DropdownMenu.Separator />
                                    <DropdownMenu.Label>自定義方案</DropdownMenu.Label>
                                    {Object.keys(customPlans).map(p => (
                                        <DropdownMenu.Item key={p} onClick={() => setPlanName(p)}>
                                            <Flex justify="between" width="100%" align="center">
                                                {p}
                                                <IconButton size="1" variant="ghost" color="red" onClick={(e) => {
                                                    e.stopPropagation();
                                                    const n = { ...customPlans }; delete n[p]; setCustomPlans(n);
                                                    if (planName === p) setPlanName("plan_a");
                                                }}><TrashIcon /></IconButton>
                                            </Flex>
                                        </DropdownMenu.Item>
                                    ))}
                                    <DropdownMenu.Separator />
                                    <DropdownMenu.Item color="indigo" onClick={() => {
                                        setEditTargetId(null); setEditTitle(`USR_${new Date().getTime().toString().slice(-4)}`);
                                        setEditContent(""); setEditorOpen(true);
                                    }}>
                                        <PlusIcon /> 新增方案...
                                    </DropdownMenu.Item>
                                    {customPlans[planName] !== undefined && (
                                        <DropdownMenu.Item onClick={() => {
                                            setEditTargetId(planName); setEditTitle(planName);
                                            setEditContent(tsvB); setEditorOpen(true);
                                        }}>
                                            <GearIcon /> 編輯方案名稱/內容...
                                        </DropdownMenu.Item>
                                    )}
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>

                            <Separator orientation="vertical" />

                            <Button size="2" variant="ghost" color="indigo" onClick={() => {
                                const result = Object.fromEntries(rows.filter(r => r.total > 0).map(r => [r.id, r.total]));
                                navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                            }}>
                                <BackpackIcon /> 複製結果
                            </Button>
                        </Flex>
                    </Flex>

                    {/* 第二列：左側對齊搜尋與工具 */}
                    <Flex align="center" gap="3">
                        <TextField.Root size="2" placeholder="搜尋項目..." className="w-56 bg-slate-50" value={search} onChange={e => setSearch(e.target.value)}>
                            <TextField.Slot><MagnifyingGlassIcon /></TextField.Slot>
                        </TextField.Root>

                        <Button size="2" variant="outline" color="gray" onClick={() => {
                            let out = "稀有度\t名稱\t原有\t需求\t合計\n";
                            rows.forEach(r => { out += `${r.rare}\t${r.name}\t${r.stock}\t${r.need}\t${r.total}\n` });
                            navigator.clipboard.writeText(out);
                        }}>
                            <CopyIcon /> 複製為 Excel
                        </Button>

                        <Separator orientation="vertical" />

                        <Flex align="center" gap="2" className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                            <Switch checked={hideEmpty} onCheckedChange={setHideEmpty} size="1" />
                            <Text size="1" weight="bold" color="gray">隱藏無關數據</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Box>

            {/* Table Area */}
            <Box flexGrow="1" p="3" className="overflow-hidden">
                <Card className="h-full p-0 overflow-hidden bg-white border-slate-200">
                    <Box className="h-full overflow-auto">
                        <Table.Root variant="surface">
                            <Table.Header className="sticky top-0 bg-white z-10 shadow-sm">
                                <Table.Row>
                                    <Table.ColumnHeaderCell width="100px">ID</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>項目名稱</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell align="right">原有</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell align="right">方案</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell align="right" className="text-indigo-600">最終合計</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {[5, 4, 3, 2, 1].map(rare => (
                                    <React.Fragment key={rare}>
                                        {groupedRows[rare].length > 0 && (
                                            <Table.Row className="bg-slate-50/50">
                                                <Table.RowHeaderCell colSpan={5} className="py-1 px-4">
                                                    <Text size="1" weight="bold" color="gray">RARE {rare}</Text>
                                                </Table.RowHeaderCell>
                                            </Table.Row>
                                        )}
                                        {groupedRows[rare].map(r => (
                                            <Table.Row key={r.id} align="center" className="hover:bg-indigo-50/30 transition-colors">
                                                <Table.Cell><Text size="1" className="font-mono text-slate-400">{r.id}</Text></Table.Cell>
                                                <Table.Cell><Text size="2" weight="medium">{r.name}</Text></Table.Cell>
                                                <Table.Cell align="right"><Text size="2" color="gray">{r.stock}</Text></Table.Cell>
                                                <Table.Cell align="right"><Text size="2" color="indigo" weight="bold">+{r.need}</Text></Table.Cell>
                                                <Table.Cell align="right" className="bg-indigo-50/10"><Text size="2" weight="bold" color="indigo">{r.total}</Text></Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Card>
            </Box>

            {/* Editor Dialog */}
            <Dialog.Root open={editorOpen} onOpenChange={setEditorOpen}>
                <Dialog.Content style={{ maxWidth: 700 }} className="rounded-3xl p-0 overflow-hidden">
                    <Box p="4" className="bg-slate-50 border-b">
                        <Flex justify="between" align="center">
                            <Text weight="bold">方案編輯器</Text>
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <Button size="1" variant="soft" color="indigo">
                                        <MagicWandIcon /> 參考預設內容 <ChevronDownIcon />
                                    </Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    <DropdownMenu.Item onClick={() => loadDefaultToEditor("plan_a")}>導入 方案 A</DropdownMenu.Item>
                                    <DropdownMenu.Item onClick={() => loadDefaultToEditor("plan_b")}>導入 方案 B</DropdownMenu.Item>
                                    <DropdownMenu.Item onClick={() => loadDefaultToEditor("plan_c")}>導入 方案 C</DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </Flex>
                    </Box>
                    <Box p="4">
                        <Flex direction="column" gap="3">
                            <Box>
                                <Text as="label" size="1" weight="bold" color="gray" mb="1">方案名稱</Text>
                                <TextField.Root placeholder="輸入方案標題..." value={editTitle} onChange={e => setEditTitle(e.target.value)} className="bg-slate-100 border-none" />
                            </Box>
                            <Box>
                                <Text as="label" size="1" weight="bold" color="gray" mb="1">TSV 數據內容</Text>
                                <textarea
                                    className="w-full h-72 p-4 rounded-xl border-none font-mono text-xs focus:ring-2 ring-indigo-500 outline-none bg-slate-100"
                                    value={editContent}
                                    onChange={e => setEditContent(e.target.value)}
                                    placeholder="活動名稱	產物	數量"
                                />
                            </Box>
                        </Flex>
                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close><Button variant="soft" color="gray">取消</Button></Dialog.Close>
                            <Button color="indigo" onClick={handleSavePlan}>確認保存</Button>
                        </Flex>
                    </Box>
                </Dialog.Content>
            </Dialog.Root>

            {/* Import Dialog */}
            <Dialog.Root open={importOpen} onOpenChange={setImportOpen}>
                <Dialog.Content style={{ maxWidth: 450 }} className="rounded-3xl">
                    <Dialog.Title size="3">導入原有數據 (JSON)</Dialog.Title>
                    <textarea
                        className="w-full h-48 p-4 rounded-xl border-none font-mono text-xs bg-slate-100 mt-4"
                        value={jsonA} onChange={e => setJsonA(e.target.value)}
                    />
                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close><Button color="indigo" className="px-6">保存</Button></Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </Flex>
    );
}
