import { type Dispatch, type SetStateAction, useCallback, useMemo } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { getDefaultPlanContent, isDefaultPlanKey } from "../assets/planLoader";

export interface IPlanManagerContext {
	planName: string;
	setPlanName: Dispatch<SetStateAction<string>>;
	customPlans: Record<string, string>;
	setCustomPlans: Dispatch<SetStateAction<Record<string, string>>>;
	tsvB: string;
	updateCustomPlan: (title: string, content: string, targetId: string | null) => void;
	deletePlan: (name: string) => void;
}

export function usePlanManager(): IPlanManagerContext {
	const [customPlans, setCustomPlans] = useLocalStorageState<Record<string, string>>("fm_custom_plans", {});
	const [planName, setPlanName] = useLocalStorageState<string>("fm_current_plan_name", "plan_a");

	const defaultTsv = isDefaultPlanKey(planName) ? getDefaultPlanContent(planName) : "";
	const tsvB = customPlans[planName] ?? defaultTsv;

	// 新增：集中處理存檔邏輯，確保正確性
	const updateCustomPlan = useCallback((title: string, content: string, targetId: string | null) => {
		const next = { ...customPlans };
		const finalTitle = title.trim() || "未命名方案";

		// 如果是更名編輯，刪除舊 key
		if (targetId && targetId !== finalTitle) {
			delete next[targetId];
		}

		next[finalTitle] = content;
		setCustomPlans(next);
		setPlanName(finalTitle); // 存檔後自動切換到該方案
	}, [customPlans, setCustomPlans, setPlanName]);

	// 新增：刪除邏輯收攏
	const deletePlan = useCallback((name: string) => {
		const next = { ...customPlans };
		delete next[name];
		setCustomPlans(next);
		if (planName === name) setPlanName("plan_a");
	}, [customPlans, setCustomPlans, planName, setPlanName]);

	// 2. 直接在 Hook 內產出穩定的 result 物件
	return useMemo(() => ({
		planName,
		setPlanName,
		customPlans,
		setCustomPlans,
		tsvB,
		updateCustomPlan,
		deletePlan,
	}), [planName, setPlanName, customPlans, setCustomPlans, tsvB, updateCustomPlan, deletePlan]);
}
