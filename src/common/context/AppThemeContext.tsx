import { Theme } from "@radix-ui/themes";
import { useLocalStorage } from "foxact/use-local-storage";
import { createContext, use, useEffect, useMemo, useState } from "react";

export type TAppearanceMode = "light" | "dark" | "system";
export type TAccentColor = "blue" | "crimson" | "grass" | "orange" | "indigo";

export interface IAppThemeContextValue {
	accentColor: TAccentColor;
	appearanceMode: TAppearanceMode;
	resolvedAppearance: "light" | "dark";
	setAccentColor: (value: TAccentColor) => void;
	setAppearanceMode: (value: TAppearanceMode) => void;
}

const APPEARANCE_KEY = "app_theme_appearance";
const ACCENT_KEY = "app_theme_accent";

const AppThemeContext = createContext<IAppThemeContextValue | null>(null);

const getSystemAppearance = (): "light" | "dark" => {
	if (typeof window === "undefined") return "dark";
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export interface IAppThemeProviderProps {
	children: React.ReactNode;
}

export const AppThemeProvider: React.FC<IAppThemeProviderProps> = ({ children }) => {
	const [appearanceMode, setAppearanceMode] = useLocalStorage<TAppearanceMode>(APPEARANCE_KEY, "system");
	const [accentColor, setAccentColor] = useLocalStorage<TAccentColor>(ACCENT_KEY, "indigo");
	const [systemAppearance, setSystemAppearance] = useState<"light" | "dark">(() => getSystemAppearance());

	useEffect(() => {
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (): void => setSystemAppearance(media.matches ? "dark" : "light");
		media.addEventListener("change", handleChange);
		return (): void => media.removeEventListener("change", handleChange);
	}, []);

	const appearance = appearanceMode === "system" ? systemAppearance : appearanceMode;

	const value = useMemo<IAppThemeContextValue>(() => ({
		accentColor,
		appearanceMode,
		resolvedAppearance: appearance,
		setAccentColor,
		setAppearanceMode,
	}), [accentColor, appearanceMode, appearance, setAccentColor, setAppearanceMode]);

	return (
		<AppThemeContext value={value}>
			<Theme appearance={appearance} accentColor={accentColor} hasBackground>
				{children}
			</Theme>
		</AppThemeContext>
	);
};

export const useAppTheme = (): IAppThemeContextValue => {
	const context = use(AppThemeContext);
	if (!context) throw new Error("useAppTheme must be used within AppThemeProvider");
	return context;
};
