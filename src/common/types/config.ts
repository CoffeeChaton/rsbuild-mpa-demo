// src/common/types/config.ts
export type TTheme = "light" | "dark";

export interface IConfigEntry {
	id: string;
	name: string;
	lastModified: number;
	theme: TTheme;
}
