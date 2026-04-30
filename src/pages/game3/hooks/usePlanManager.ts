import { useLocalStorage } from "foxact/use-local-storage";
import { type Dispatch, type SetStateAction, useCallback, useMemo } from "react";
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
	const [customPlans, setCustomPlans] = useLocalStorage<Record<string, string>>("fm_custom_plans", {});
	const [planName, setPlanName] = useLocalStorage<string>("fm_current_plan_name", "plan_a");

	const tsvB = useMemo(() => {
		const name = planName;
		const plans = customPlans;
		const defaultTsv = isDefaultPlanKey(name) ? getDefaultPlanContent(name) : "";
		return plans[name] ?? defaultTsv;
	}, [customPlans, planName]);

	const updateCustomPlan = useCallback((title: string, content: string, targetId: string | null) => {
		const finalTitle = title.trim() || "未命名方案";
		setCustomPlans(prev => {
			const current = prev ?? {};
			const next: Record<string, string> = {};
			for (const [key, value] of Object.entries(current)) {
				if (key !== targetId) {
					next[key] = value;
				}
			}
			next[finalTitle] = content;
			return next;
		});
		setPlanName(finalTitle);
	}, [setCustomPlans, setPlanName]);

	const deletePlan = useCallback((name: string) => {
		setCustomPlans(prev => {
			const current = prev ?? {};
			const next: Record<string, string> = {};
			for (const [key, value] of Object.entries(current)) {
				if (key !== name) {
					next[key] = value;
				}
			}
			return next;
		});
		if (planName === name) setPlanName("plan_a");
	}, [planName, setCustomPlans, setPlanName]);

	const memoizedSetPlanName = useCallback((action: SetStateAction<string>) => {
		if (typeof action === "function") {
			setPlanName(prev => action(prev ?? "plan_a"));
		} else {
			setPlanName(action);
		}
	}, [setPlanName]);

	const memoizedSetCustomPlans = useCallback((action: SetStateAction<Record<string, string>>) => {
		if (typeof action === "function") {
			setCustomPlans(prev => action(prev ?? {}));
		} else {
			setCustomPlans(action);
		}
	}, [setCustomPlans]);

	return useMemo(() => ({
		planName,
		setPlanName: memoizedSetPlanName,
		customPlans,
		setCustomPlans: memoizedSetCustomPlans,
		tsvB,
		updateCustomPlan,
		deletePlan,
	}), [planName, memoizedSetPlanName, customPlans, memoizedSetCustomPlans, tsvB, updateCustomPlan, deletePlan]);
}
