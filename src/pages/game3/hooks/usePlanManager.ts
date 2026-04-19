import { type Dispatch, type SetStateAction, useCallback, useMemo } from "react";
import * as v from "valibot";
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

const CustomPlansSchema = v.record(v.string(), v.string());
const PlanNameSchema = v.string();

function omitPlan(plans: Record<string, string>, omittedPlanName: string): Record<string, string> {
	const nextPlans: Record<string, string> = {};

	for (const [planKey, planContent] of Object.entries(plans)) {
		if (planKey !== omittedPlanName) {
			nextPlans[planKey] = planContent;
		}
	}

	return nextPlans;
}

export function usePlanManager(): IPlanManagerContext {
	const [customPlans, setCustomPlans] = useLocalStorageState<Record<string, string>>("fm_custom_plans", {}, CustomPlansSchema);
	const [planName, setPlanName] = useLocalStorageState<string>("fm_current_plan_name", "plan_a", PlanNameSchema);

	const defaultTsv = isDefaultPlanKey(planName) ? getDefaultPlanContent(planName) : "";
	const tsvB = customPlans[planName] ?? defaultTsv;

	// 新增：集中處理存檔邏輯，確保正確性
	const updateCustomPlan = useCallback((title: string, content: string, targetId: string | null) => {
		const finalTitle = title.trim() || "未命名方案";
		const renamedPlans = targetId && targetId !== finalTitle ? omitPlan(customPlans, targetId) : customPlans;
		const nextPlans = {
			...renamedPlans,
			[finalTitle]: content,
		};

		setCustomPlans(nextPlans);
		setPlanName(finalTitle); // 存檔後自動切換到該方案
	}, [customPlans, setCustomPlans, setPlanName]);

	// 新增：刪除邏輯收攏
	const deletePlan = useCallback((name: string) => {
		setCustomPlans(omitPlan(customPlans, name));
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
