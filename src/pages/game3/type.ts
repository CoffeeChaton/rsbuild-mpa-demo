export interface IItemRow {
  id: string;
  name: string;
  rare: number;
  stock: number;
  need: number;
  total: number;
}

export type TEditor = {
  open: boolean,
  targetId: string | null,
  title: string,
  content: string,
};

export type TFilter = {
  search: string,
  hideEmpty: boolean,
};
