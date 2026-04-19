import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import type { BaseSchema, InferOutput } from "valibot";
import * as v from "valibot";

export function useLocalStorageState<T>(
	key: string,
	defaultValue: T,
	schema: BaseSchema<unknown, T, v.BaseIssue<unknown>>,
): readonly [T, Dispatch<SetStateAction<T>>] {
	const [state, setState] = useState<T>(() => {
		try {
			const stored = localStorage.getItem(key);
			if (!stored) {
				return defaultValue;
			}

			const parsed: InferOutput<typeof schema> = v.parse(schema, JSON.parse(stored));
			return parsed;
		} catch {
			return defaultValue;
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(state));
		} catch {
			toast.warning("localStorage save failed:" + key);
		}
	}, [key, state]);

	return [state, setState] as const;
}
