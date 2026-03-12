// shared/schemas/items.schema.ts
import * as v from "valibot";

export const ItemSchema = v.object({
  type: v.number(),
  sortId: v.number(),
  rare: v.number(),
  formulaType: v.fallback(v.nullable(v.string()), null),
  formula: v.fallback(v.nullable(v.record(v.string(), v.number())), null),
  name: v.object({
    cn: v.string(),
    tw: v.string(),
    us: v.string(),
  }),
});

// 使用 InferOutput 獲取轉換後的型別
export type TItem = v.InferOutput<typeof ItemSchema>;
