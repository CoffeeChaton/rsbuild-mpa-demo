// src/pages/game2/context/ArsenalContext.tsx
import React, { createContext, type Dispatch, type PropsWithChildren, type SetStateAction, use, useMemo } from "react";
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
	handleImport: () => void;
	handleExport: () => void;
	isCopied: boolean;
}

const ItemsContext = createContext<IItemsContext | null>(null);
const InventoryContext = createContext<IInventoryContext | null>(null);
const RowsContext = createContext<IRowsContext | null>(null);
const ActionsContext = createContext<IActionsContext | null>(null);

interface IArsenalProviderInnerProps extends PropsWithChildren {
	configId: string;
}

const ArsenalProviderInner: React.FC<IArsenalProviderInnerProps> = ({ children, configId }) => {
	const { items, setItems, inventory, setInventory } = useArsenalStorage(configId);

	const levelData = v.parse(LevelDataSchema, rawLevelData);
	const rows = useArsenalRowsRaw(items, inventory, levelData);
	const { handleImport, handleExport, isCopied } = useArsenalTSV(setItems, inventory, setInventory, rows);

	const itemsValue = useMemo(() => ({ items, setItems }), [items, setItems]);
	const inventoryValue = useMemo(() => ({ inventory, setInventory }), [inventory, setInventory]);
	const rowsValue = useMemo(() => ({ rows }), [rows]);
	const actionsValue = useMemo(() => ({ handleImport, handleExport, isCopied }), [handleImport, handleExport, isCopied]);

	return (
		<ItemsContext value={itemsValue}>
			<InventoryContext value={inventoryValue}>
				<RowsContext value={rowsValue}>
					<ActionsContext value={actionsValue}>
						{children}
					</ActionsContext>
				</RowsContext>
			</InventoryContext>
		</ItemsContext>
	);
};

export const ArsenalProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const currentConfigId = useCurrentConfigId();
	return (
		<ArsenalProviderInner key={currentConfigId} configId={currentConfigId}>
			{children}
		</ArsenalProviderInner>
	);
};

export const useArsenalItems: () => IItemsContext = () => {
	const context = use(ItemsContext);
	if (!context) throw new Error("useArsenalItems must be used within ArsenalProvider");
	return context;
};

export const useArsenalInventory: () => IInventoryContext = () => {
	const context = use(InventoryContext);
	if (!context) throw new Error("useArsenalInventory must be used within ArsenalProvider");
	return context;
};

export const useArsenalRows: () => IRowsContext = () => {
	const context = use(RowsContext);
	if (!context) throw new Error("useArsenalRows must be used within ArsenalProvider");
	return context;
};

export const useArsenalActions: () => IActionsContext = () => {
	const context = use(ActionsContext);
	if (!context) throw new Error("useArsenalActions must be used within ArsenalProvider");
	return context;
};
