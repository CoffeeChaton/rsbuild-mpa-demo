import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export function useLocalStorageState<T>(
	key: string,
	defaultValue: T,
): readonly [T, Dispatch<SetStateAction<T>>] {
	const [state, setState] = useState<T>(() => {
		try {
			const stored = localStorage.getItem(key);
			return stored ? JSON.parse(stored) : defaultValue;
		} catch {
			return defaultValue;
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(state));
		} catch {
			console.warn("localStorage save failed:", key);
		}
	}, [key, state]);

	return [state, setState] as const;
}
