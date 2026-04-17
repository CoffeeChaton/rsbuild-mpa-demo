import planB from "./plan_b.tsv?raw";
import planC from "./plan_c.tsv?raw";

export const DEFAULT_PLAN_CONTENT: {
	readonly plan_b: string,
	readonly plan_c: string,
} = {
	plan_b: planB,
	plan_c: planC,
};

export type TDefaultPlanKey = keyof typeof DEFAULT_PLAN_CONTENT;

export function getDefaultPlanContent(key: TDefaultPlanKey): string {
	return DEFAULT_PLAN_CONTENT[key];
}
