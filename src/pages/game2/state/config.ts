// src/pages/game2/state/config.ts
import { createLocalStorageState } from "foxact/create-local-storage-state";
import { STORAGE_KEY } from "../config/constants";
import type { IConfigEntry } from "../types/config";
import type { StateHook, ValueHook } from "foxact/create-storage-state-factory";

const CONFIG_LIST_KEY = `${STORAGE_KEY}_list`;
const CURRENT_CONFIG_KEY = `${STORAGE_KEY}_current`;

const config = createLocalStorageState<IConfigEntry[]>(CONFIG_LIST_KEY, [{ id: "default", name: "預設存檔", lastModified: Date.now() }]);
export const useConfigs: StateHook<IConfigEntry[]> = config[0];
export const useConfigsValue: ValueHook<IConfigEntry[]> = config[1];

const currentConfig = createLocalStorageState<string>(CURRENT_CONFIG_KEY, "default");
export const useCurrentConfigId: StateHook<string> = currentConfig[0];
export const useCurrentConfigIdValue: ValueHook<string> = currentConfig[1];
