import { useEffect } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { DEFAULT_PLANS, type TDefaultPlanKey, tsvFetcher } from "../assets/planLoader";
import { mutate } from "swr";
import useSWRImmutable from "swr/immutable";

export function usePlanManager() {
  const [customPlans, setCustomPlans] = useLocalStorageState<Record<string, string>>("fm_custom_plans", {});
  const [planName, setPlanName] = useLocalStorageState<string>("fm_current_plan_name", "plan_a");

  // 1. 使用 SWR 處理靜態資產載入
  // 如果是 custom 方案，SWR Key 為 null，不觸發 fetcher
  const isDefault = planName in DEFAULT_PLANS;
  const { data: defaultTsv } = useSWRImmutable(
    isDefault ? planName : null,
    tsvFetcher,
  );

  // 2. 最終的 TSV 來源：優先看自定義，再看 SWR 載入的預設值
  const tsvB = customPlans[planName] ?? defaultTsv ?? "";

  // 3. 預載邏輯：利用 SWR 的 mutate 預熱快取
  useEffect(() => {
    // 渲染完成後，預載剩餘的預設方案
    Object.keys(DEFAULT_PLANS).forEach((key) => {
      if (key !== planName) {
        mutate(key, tsvFetcher(key as TDefaultPlanKey), false);
      }
    });
  }, [planName]);

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
