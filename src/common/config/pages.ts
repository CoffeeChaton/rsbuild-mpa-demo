export interface IPageInfo {
  title: string;
  description: string;
  label: string;      // 用於 Navbar 顯示的文字
  hidden?: boolean;   // 是否在 Navbar 隱藏（例如 404）
}

export const PAGE_MAP = {
  index: {
    title: '首頁 - 品牌門面',
    description: '歡迎來到我們的品牌官網',
    label: '首頁'
  },
  products: {
    title: '產品清單 - 優質選物',
    description: '探索我們精選的產品系列',
    label: '產品'
  },
  'map-edit': { // 新增地圖編輯頁面
    title: '地圖編輯器 - GIS 控制台',
    description: '自定義您的地圖偏好與中心點',
    label: '地圖編輯'
  },
  'game': { // 新增地圖編輯頁面
    title: '明日方舟工具箱 精英材料PLUS',
    description: '計算材料 PLUS',
    label: '工具箱PLUS'
  },
  'IniEdit': {
    title: '明日方舟工具箱 精英材料PLUS',
    description: '計算材料 PLUS',
    label: '工具箱PLUS'
  },
  '404': {
    title: '404 - 找不到頁面',
    description: '抱歉，您訪問的頁面不存在',
    label: '404',
    hidden: true
  },
} as const satisfies Record<string, IPageInfo>;

// 定義導出的 Key 型別，供其他工具使用
export type TPageKey = keyof typeof PAGE_MAP;
