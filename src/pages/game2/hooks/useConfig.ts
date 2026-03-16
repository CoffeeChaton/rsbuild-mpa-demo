// src/pages/game2/hooks/useConfig.ts
import { useContext } from "react";
import { ConfigContext, type IConfigContext } from "../context/ConfigContext";

export const useConfig: () => IConfigContext = () => {
	const context = useContext(ConfigContext);
	if (!context) throw new Error("useConfig must be used within ConfigProvider");
	return context;
};
