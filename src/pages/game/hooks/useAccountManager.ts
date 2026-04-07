import useSWR from "swr";
import type { IAccountProfile, IConfigGroup, TAccountId } from "../types";

const STORAGE_KEY = "ARK_RESOURCE_DATA";
const INITIAL_ACCOUNT: IAccountProfile = {
	id: "default",
	accountName: "預設帳號",
	server: "TW",
	configs: [],
};

/**
 * 需求：定義 Account 管理 Hook 的回傳結構
 * 規範：I 開頭為介面，使用中文說明各項功能
 */
export interface IAccountManager {
	/** 當前選中的帳號 ID */
	activeId: TAccountId;

	/** 所有帳號配置列表 */
	profiles: IAccountProfile[];

	/** 當前活動帳號的完整對象 (計算屬性) */
	currentAccount: IAccountProfile;

	/** 切換當前活動帳號 */
	setActiveId: (id: TAccountId) => void;

	/** 新增帳號 (自動生成 UUID 並防止重複) */
	addAccount: (name: string, server?: string) => void;

	/** 刪除指定帳號 (若刪除的是當前帳號，會自動切換至下一個) */
	deleteAccount: (id: TAccountId) => void;

	/** 更新帳號的基本資訊 (名稱、伺服器) */
	updateAccountInfo: (id: TAccountId, name: string, server: string) => void;

	/** 核心：更新當前帳號的材料配置組 (解決撞 ID 的關鍵點) */
	updateConfigs: (newConfigs: IConfigGroup[]) => void;
}

/**
 * SWR Fetcher: 專門負責從 LocalStorage 讀取與解析
 */
const storageFetcher = (key: string): IAccountProfile[] => {
	try {
		const saved = localStorage.getItem(key);
		if (!saved) return [INITIAL_ACCOUNT];
		const parsed = JSON.parse(saved);
		return Array.isArray(parsed) && parsed.length > 0 ? parsed : [INITIAL_ACCOUNT];
	} catch {
		return [INITIAL_ACCOUNT];
	}
};

export function useAccountManager(): IAccountManager {
	// 1. 使用 SWR 管理 Profiles (狀態同步與持久化)
	const { data: profiles = [INITIAL_ACCOUNT], mutate } = useSWR<IAccountProfile[]>(
		STORAGE_KEY,
		storageFetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			// 這裡不需要額外的 useEffect，當數據變動時手動呼叫持久化
		},
	);

	// 2. 活動帳號 ID (這部分也可以抽出去單獨 SWR，或維持現狀)
	const { data: activeId = "default", mutate: mutateActiveId } = useSWR<TAccountId>(
		"ACTIVE_ACCOUNT_ID",
		() => (localStorage.getItem("ACTIVE_ACCOUNT_ID") as TAccountId) || "default",
		{ revalidateOnFocus: false },
	);

	// 計算屬性
	const currentAccount = profiles.find((p) => p.id === activeId) || profiles[0] || INITIAL_ACCOUNT;

	// 封裝持久化寫入邏輯
	const persist = (newData: IAccountProfile[]) => {
		void mutate(newData, false); // 先更新本地快取 (Optimistic)
		localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
	};

	const setActiveId = (id: TAccountId) => {
		void mutateActiveId(id, false);
		localStorage.setItem("ACTIVE_ACCOUNT_ID", id);
	};

	const updateConfigs = (newConfigs: IConfigGroup[]) => {
		const next = profiles.map((p) => p.id === currentAccount.id ? { ...p, configs: newConfigs } : p);
		persist(next);
	};

	const addAccount = (name: string, server: string = "CN") => {
		const next = [
			...profiles,
			{
				id: crypto.randomUUID(),
				accountName: name,
				server,
				configs: [],
			},
		];
		persist(next);
	};

	const deleteAccount = (id: TAccountId) => {
		if (profiles.length <= 1) return;
		const next = profiles.filter((p) => p.id !== id);
		if (activeId === id) setActiveId(next[0].id);
		persist(next);
	};

	const updateAccountInfo = (id: TAccountId, name: string, server: string) => {
		const next = profiles.map((p) => p.id === id ? { ...p, accountName: name, server } : p);
		persist(next);
	};

	return {
		activeId,
		profiles,
		currentAccount,
		setActiveId,
		addAccount,
		deleteAccount,
		updateAccountInfo,
		updateConfigs,
	};
}
