// AccountLogic.ts
import { useState, useMemo, useEffect } from 'react';
import type { IAccountProfile, TAccountId, IConfigGroup } from './types';

const STORAGE_KEY = 'ARK_RESOURCE_DATA';
const INITIAL_ACCOUNT: IAccountProfile = {
  id: 'default',
  accountName: '預設帳號',
  server: 'TW',
  configs: []
};

export function useAccountManager() {
  const [profiles, setProfiles] = useState<IAccountProfile[]>([]);
  const [activeId, setActiveId] = useState<TAccountId>('default');
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
    setProfiles(prev => prev.map(p =>
      p.id === currentAccount.id ? { ...p, configs: newConfigs } : p
    ));
  };

  const addAccount = (name: string, server: string = 'CN') => {
    setProfiles(prev => [...prev, {
      id: crypto.randomUUID(),
      accountName: name,
      server,
      configs: []
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
    updateConfigs
  };
}
