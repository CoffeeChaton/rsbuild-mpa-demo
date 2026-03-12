import { useEffect, useState } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

export function usePlanManager() {
  const [tsvB, setTsvB] = useState<string>("");
  const [customPlans, setCustomPlans] = useLocalStorageState<Record<string, string>>("fm_custom_plans", {});
  const [planName, setPlanName] = useLocalStorageState<string>("fm_current_plan_name", "plan_a");

  // 新增：集中處理存檔邏輯，確保正確性
  const updateCustomPlan = (title: string, content: string, targetId: string | null) => {
    const next = { ...customPlans };
    const finalTitle = title.trim() || "未命名方案";

    // 如果是更名編輯，刪除舊 key
    if (targetId && targetId !== finalTitle) {
      delete next[targetId];
    }

    next[finalTitle] = content;
    setCustomPlans(next);
    setPlanName(finalTitle); // 存檔後自動切換到該方案
  };

  // 新增：刪除邏輯收攏
  const deletePlan = (name: string) => {
    const next = { ...customPlans };
    delete next[name];
    setCustomPlans(next);
    if (planName === name) setPlanName("plan_a");
  };

  // 載入 TSV
  useEffect(() => {
    const fetchTsv = async () => {
      if (customPlans[planName] !== undefined) {
        setTsvB(customPlans[planName]);
      } else {
        try {
          const m = await import(`../assets/${planName}.tsv?raw`);
          setTsvB(m.default);
        } catch {
          setTsvB("");
        }
      }
    };

    fetchTsv();
  }, [planName, customPlans]);

  return {
    planName,
    setPlanName,
    customPlans,
    setCustomPlans,
    tsvB,
    updateCustomPlan,
    deletePlan,
  };
}
