import type { TEditor } from "../type";
import { type Context, createContext, use } from "react";

export interface IPlanContext {
	planName: string;
	setPlanName: (v: string) => void;
	customPlans: Record<string, string>;
	setCustomPlans: (v: Record<string, string>) => void;
	tsvB: string;
	setEditorOpen: (open: boolean, data?: Partial<TEditor>) => void;
	updateCustomPlan: (title: string, content: string, targetId: string | null) => void;
	deletePlan: (name: string) => void;
}

export const PlanContext: Context<IPlanContext | null> = createContext<IPlanContext | null>(null);

export function usePlanContext(): IPlanContext {
	const ctx = use(PlanContext);

	if (!ctx) {
		throw new Error("usePlanContext must be used inside PlanContext");
	}

	return ctx;
}
