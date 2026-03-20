/* eslint-disable react-refresh/only-export-components */
// src/pages/game2/context/ArsenalContext.tsx
import React, { createContext, type Dispatch, type PropsWithChildren, type SetStateAction, useContext, useMemo } from "react";
import { useArsenalStorage } from "../hooks/useArsenalStorage";
import { useArsenalRowsRaw } from "../hooks/useArsenalRowsRaw";
import { useArsenalTSV } from "../hooks/useArsenalTSV";
import type { IInventory, IItem, IRowResult } from "../types";
import { useCurrentConfigId } from "../../../common/hooks/useConfig";
import { LevelDataSchema } from "../core/data";
import rawLevelData from "@/src/assets/level.json"; // only 5KM use import
import * as v from "valibot";

// Split contexts to prevent unnecessary re-renders
interface IItemsContext {
	items: IItem[];
	setItems: Dispatch<SetStateAction<IItem[]>>;
}

interface IInventoryContext {
	inventory: IInventory;
	setInventory: Dispatch<SetStateAction<IInventory>>;
}

interface IRowsContext {
	rows: IRowResult[];
}

interface IActionsContext {
	handleImport: () => Promise<void>;
	handleExport: () => void;
	isCopied: boolean;
}

const ItemsContext = createContext<IItemsContext | null>(null);
const InventoryContext = createContext<IInventoryContext | null>(null);
const RowsContext = createContext<IRowsContext | null>(null);
const ActionsContext = createContext<IActionsContext | null>(null);

export const ArsenalProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const currentConfigId = useCurrentConfigId();
	const { items, setItems, inventory, setInventory } = useArsenalStorage(currentConfigId);

	const levelData = v.parse(LevelDataSchema, rawLevelData);
	const rows = useArsenalRowsRaw(items, inventory, levelData);
	const { handleImport, handleExport, isCopied } = useArsenalTSV(setItems, inventory, setInventory, rows);

	const itemsValue = useMemo(() => ({ items, setItems }), [items, setItems]);
	const inventoryValue = useMemo(() => ({ inventory, setInventory }), [inventory, setInventory]);
	const rowsValue = useMemo(() => ({ rows }), [rows]);
	const actionsValue = useMemo(() => ({ handleImport, handleExport, isCopied }), [handleImport, handleExport, isCopied]);

	return (
		<ItemsContext.Provider value={itemsValue}>
			<InventoryContext.Provider value={inventoryValue}>
				<RowsContext.Provider value={rowsValue}>
					<ActionsContext.Provider value={actionsValue}>
						{children}
					</ActionsContext.Provider>
				</RowsContext.Provider>
			</InventoryContext.Provider>
		</ItemsContext.Provider>
	);
};

export const useArsenalItems: () => IItemsContext = () => {
	const context = useContext(ItemsContext);
	if (!context) throw new Error("useArsenalItems must be used within ArsenalProvider");
	return context;
};

export const useArsenalInventory: () => IInventoryContext = () => {
	const context = useContext(InventoryContext);
	if (!context) throw new Error("useArsenalInventory must be used within ArsenalProvider");
	return context;
};

export const useArsenalRows: () => IRowsContext = () => {
	const context = useContext(RowsContext);
	if (!context) throw new Error("useArsenalRows must be used within ArsenalProvider");
	return context;
};

export const useArsenalActions: () => IActionsContext = () => {
	const context = useContext(ActionsContext);
	if (!context) throw new Error("useArsenalActions must be used within ArsenalProvider");
	return context;
};
