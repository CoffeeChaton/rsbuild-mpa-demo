/**
 * @description 類型斷言工具：檢查 T 和 Expected 是否完全相同。
 */
export type TAssertEqual<T, Expected> =
  [T] extends [Expected]
    ? [Expected] extends [T]
      ? T
      : never
    : never;

/**
 * @description 檢查型別是否非 never。
 */
export type TIsNotNever<T> = [T] extends [never] ? false : true;
