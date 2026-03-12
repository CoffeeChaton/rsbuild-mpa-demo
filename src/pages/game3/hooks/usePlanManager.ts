import { useEffect, useState } from "react";

export function usePlanManager() {
  const [planName, setPlanName] = useState<string>(
    () => localStorage.getItem("fm_current_plan_name") || "plan_a",
  );

  const [customPlans, setCustomPlans] = useState<Record<string, string>>(
    () => {
      const saved = localStorage.getItem("fm_custom_plans");
      return saved ? JSON.parse(saved) : {};
    },
  );

  const [tsvB, setTsvB] = useState<string>("");

  // 保存 custom plans
  useEffect(() => {
    localStorage.setItem("fm_custom_plans", JSON.stringify(customPlans));
  }, [customPlans]);

  // 保存當前方案
  useEffect(() => {
    localStorage.setItem("fm_current_plan_name", planName);
  }, [planName]);

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
