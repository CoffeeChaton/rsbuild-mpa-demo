// src/pages/game2/state/config.ts
import { createLocalStorageState } from "foxact/create-local-storage-state";
import { STORAGE_KEY } from "../config/constants";
import type { IConfigEntry } from "../types/config";

const CONFIG_LIST_KEY = `${STORAGE_KEY}_list`;
const CURRENT_CONFIG_KEY = `${STORAGE_KEY}_current`;

export const [useConfigs, useConfigsValue] = createLocalStorageState<IConfigEntry[]>(
	CONFIG_LIST_KEY,
	[{ id: "default", name: "預設存檔", lastModified: Date.now() }],
);

export const [useCurrentConfigId, useCurrentConfigIdValue] = createLocalStorageState<string>(
	CURRENT_CONFIG_KEY,
	"default",
);
