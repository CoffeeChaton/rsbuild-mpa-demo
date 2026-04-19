import planB from "./plan_b.tsv?raw";
import planC from "./plan_c.tsv?raw";

const DEFAULT_PLAN_CONTENT: {
	readonly plan_b: string,
	readonly plan_c: string,
} = {
	plan_b: planB,
	plan_c: planC,
};

type TDefaultPlanKey = keyof typeof DEFAULT_PLAN_CONTENT;
const DEFAULT_PLAN_KEY_SET: ReadonlySet<string> = new Set(Object.keys(DEFAULT_PLAN_CONTENT));

export function getDefaultPlanContent(key: TDefaultPlanKey): string {
	return DEFAULT_PLAN_CONTENT[key];
}

export function isDefaultPlanKey(value: string): value is TDefaultPlanKey {
	return DEFAULT_PLAN_KEY_SET.has(value);
}
