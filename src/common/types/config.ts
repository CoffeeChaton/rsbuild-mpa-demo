// src/common/types/config.ts
import * as v from "valibot";

export type TConfigEntry = {
	id: string,
	name: string,
	lastModified: number,
};

export const ConfigEntrySchema: v.GenericSchema<TConfigEntry> = v.object({
	id: v.string(),
	name: v.string(),
	lastModified: v.number(),
});
