import { useEffect, useState } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

export function usePlanManager() {
  const [tsvB, setTsvB] = useState<string>("");

  // 保存 custom plans
  const [customPlans, setCustomPlans] = useLocalStorageState<Record<string, string>>("fm_custom_plans", {});
  // 保存當前方案
  const [planName, setPlanName] = useLocalStorageState<string>("fm_current_plan_name", "plan_a");

  // 載入 TSV
  useEffect(() => {
    const fetchTsv = async () => {
      if (customPlans[planName] !== undefined) {
        setTsvB(customPlans[planName]);
      } else if (planName.startsWith("plan_")) {
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
  };
}
