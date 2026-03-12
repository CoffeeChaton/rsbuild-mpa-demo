// AccountLogic.ts
import { useEffect, useMemo, useState } from "react";
import type { IAccountProfile, IConfigGroup, TAccountId } from "./types";

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

export function useAccountManager(): IAccountManager {
  const [profiles, setProfiles] = useState<IAccountProfile[]>([]);
  const [activeId, setActiveId] = useState<TAccountId>("default");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setProfiles(parsed as IAccountProfile[]);
        } else {
          setProfiles([INITIAL_ACCOUNT]);
        }
      } catch {
        setProfiles([INITIAL_ACCOUNT]);
      }
    } else {
      setProfiles([INITIAL_ACCOUNT]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    }
  }, [profiles, isLoaded]);

  const currentAccount = useMemo(() => {
    return profiles.find(p => p.id === activeId) || profiles[0] || INITIAL_ACCOUNT;
  }, [profiles, activeId]);

  const updateConfigs = (newConfigs: IConfigGroup[]) => {
    setProfiles(prev => prev.map(p => p.id === currentAccount.id ? { ...p, configs: newConfigs } : p));
  };

  const addAccount = (name: string, server: string = "CN") => {
    setProfiles(prev => [...prev, {
      id: crypto.randomUUID(),
      accountName: name,
      server,
      configs: [],
    }]);
  };

  const deleteAccount = (id: TAccountId) => {
    if (profiles.length <= 1) return;
    setProfiles(prev => {
      const filtered = prev.filter(p => p.id !== id);
      if (activeId === id) setActiveId(filtered[0].id);
      return filtered;
    });
  };

  const updateAccountInfo = (id: TAccountId, name: string, server: string) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, accountName: name, server } : p));
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
