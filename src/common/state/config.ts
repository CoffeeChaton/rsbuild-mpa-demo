// src/common/state/config.ts
import { createLocalStorageState } from "foxact/create-local-storage-state";
import { CONFIG_LIST_KEY, CURRENT_CONFIG_KEY } from "../config/constants";
import type { IConfigEntry } from "../types/config";
import type { StateHook, ValueHook } from "foxact/create-storage-state-factory";

const config = createLocalStorageState<IConfigEntry[]>(CONFIG_LIST_KEY, [{ id: "default", name: "預設存檔", lastModified: Date.now(), theme: "dark" }]);
export const useConfigs: StateHook<IConfigEntry[]> = config[0];
export const useConfigsValue: ValueHook<IConfigEntry[]> = config[1];

const currentConfig = createLocalStorageState<string>(CURRENT_CONFIG_KEY, "default");
export const useCurrentConfigId: StateHook<string> = currentConfig[0];
export const useCurrentConfigIdValue: ValueHook<string> = currentConfig[1];
