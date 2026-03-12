/**
 * 需求：定義全域數據結構
 * 規範：T 開頭為型別，I 開頭為介面
 */
export type TAccountId = string;

export interface IMaterialEntry {
  name: string;
  amount: number;
  itemNote: string;
}

export interface IConfigGroup {
  id: string;
  isEnabled: boolean;
  isCollapsed: boolean;
  listName: string; // 組標題
  description: string; // 一行說明
  materials: IMaterialEntry[];
}

export interface IAccountProfile {
  id: TAccountId;
  accountName: string;
  server: string;
  configs: IConfigGroup[];
}
