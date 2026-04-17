/* eslint-disable react-refresh/only-export-components */
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { Theme } from "@radix-ui/themes";

export type TAppearanceMode = "light" | "dark" | "system";
export type TAccentColor = "blue" | "crimson" | "grass" | "orange" | "indigo";

interface IAppThemeContextValue {
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

export const AppThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [appearanceMode, setAppearanceMode] = useState<TAppearanceMode>(() => {
		if (typeof window === "undefined") return "system";
		const saved = window.localStorage.getItem(APPEARANCE_KEY);
		return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
	});
	const [accentColor, setAccentColor] = useState<TAccentColor>(() => {
		if (typeof window === "undefined") return "indigo";
		const saved = window.localStorage.getItem(ACCENT_KEY);
		return saved === "blue" || saved === "crimson" || saved === "grass" || saved === "orange" || saved === "indigo"
			? saved
			: "indigo";
	});
	const [systemAppearance, setSystemAppearance] = useState<"light" | "dark">(() => getSystemAppearance());

	useEffect(() => {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(APPEARANCE_KEY, appearanceMode);
	}, [appearanceMode]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(ACCENT_KEY, accentColor);
	}, [accentColor]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => setSystemAppearance(media.matches ? "dark" : "light");
		handleChange();
		media.addEventListener("change", handleChange);
		return () => media.removeEventListener("change", handleChange);
	}, []);

	const value = useMemo<IAppThemeContextValue>(() => ({
		accentColor,
		appearanceMode,
		resolvedAppearance: appearanceMode === "system" ? systemAppearance : appearanceMode,
		setAccentColor,
		setAppearanceMode,
	}), [accentColor, appearanceMode, systemAppearance]);

	const appearance = appearanceMode === "system" ? systemAppearance : appearanceMode;

	return (
		<AppThemeContext.Provider value={value}>
			<Theme appearance={appearance} accentColor={accentColor} hasBackground>
				{children}
			</Theme>
		</AppThemeContext.Provider>
	);
};

export const useAppTheme = (): IAppThemeContextValue => {
	const context = useContext(AppThemeContext);
	if (!context) throw new Error("useAppTheme must be used within AppThemeProvider");
	return context;
};
