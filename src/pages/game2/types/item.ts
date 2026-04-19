import * as v from "valibot";

export type TFieldError =
	| "moduleFrom"
	| "moduleTo"
	| "e1"
	| "l1"
	| "e2"
	| "l2"
	| "progress"
	| "moduleRange"
	| "name"
	| "note";

export interface IItemError {
	messages: string[];
	/** 鍵值為欄位名，值為該欄位的錯誤訊息字串 */
	fields: Partial<Record<TFieldError, string>>;
}

/**
 * 基本需求項目
 *
 * 對應一個角色的培養需求
 */
export interface IItem {
	id: string;

	/**
	 * 是否參與計算
	 */
	calculate: boolean;

	/** 稀有度 1~6 */
	rarity: number;

	/**
	 * 角色名稱
	 */
	name: string;

	/**
	 * 備註
	 */
	note: string;

	/**
	 * 模組等級
	 */
	moduleFrom: string;
	moduleTo: string;

	/**
	 * FROM 等級
	 */
	e1: string;
	l1: string;

	/**
	 * TO 等級
	 */
	e2: string;
	l2: string;

	/** 錯誤訊息 */
	error?: IItemError;
}

type TStoredItemErrorFields = {
	moduleFrom?: string | undefined,
	moduleTo?: string | undefined,
	e1?: string | undefined,
	l1?: string | undefined,
	e2?: string | undefined,
	l2?: string | undefined,
	progress?: string | undefined,
	moduleRange?: string | undefined,
	name?: string | undefined,
	note?: string | undefined,
};

type TStoredItemError = {
	messages: string[],
	fields: TStoredItemErrorFields,
};

type TStoredItem = Omit<IItem, "error"> & {
	error?: TStoredItemError | undefined,
};

const ItemErrorFieldsSchemaInternal: v.GenericSchema<TStoredItemErrorFields> = v.object({
	moduleFrom: v.optional(v.string()),
	moduleTo: v.optional(v.string()),
	e1: v.optional(v.string()),
	l1: v.optional(v.string()),
	e2: v.optional(v.string()),
	l2: v.optional(v.string()),
	progress: v.optional(v.string()),
	moduleRange: v.optional(v.string()),
	name: v.optional(v.string()),
	note: v.optional(v.string()),
});
export const ItemErrorFieldsSchema: typeof ItemErrorFieldsSchemaInternal = ItemErrorFieldsSchemaInternal;

const ItemErrorSchemaInternal: v.GenericSchema<TStoredItemError> = v.object({
	messages: v.array(v.string()),
	fields: ItemErrorFieldsSchema,
});
export const ItemErrorSchema: typeof ItemErrorSchemaInternal = ItemErrorSchemaInternal;

const StoredItemSchemaInternal: v.GenericSchema<TStoredItem> = v.object({
	id: v.string(),
	calculate: v.boolean(),
	rarity: v.number(),
	name: v.string(),
	note: v.string(),
	moduleFrom: v.string(),
	moduleTo: v.string(),
	e1: v.string(),
	l1: v.string(),
	e2: v.string(),
	l2: v.string(),
	error: v.optional(ItemErrorSchema),
});
export const StoredItemSchema: typeof StoredItemSchemaInternal = StoredItemSchemaInternal;

function toItemErrorFields(fields: TStoredItemError["fields"]): Partial<Record<TFieldError, string>> {
	const nextFields: Partial<Record<TFieldError, string>> = {};

	if (fields.moduleFrom !== undefined) nextFields.moduleFrom = fields.moduleFrom;
	if (fields.moduleTo !== undefined) nextFields.moduleTo = fields.moduleTo;
	if (fields.e1 !== undefined) nextFields.e1 = fields.e1;
	if (fields.l1 !== undefined) nextFields.l1 = fields.l1;
	if (fields.e2 !== undefined) nextFields.e2 = fields.e2;
	if (fields.l2 !== undefined) nextFields.l2 = fields.l2;
	if (fields.progress !== undefined) nextFields.progress = fields.progress;
	if (fields.moduleRange !== undefined) nextFields.moduleRange = fields.moduleRange;
	if (fields.name !== undefined) nextFields.name = fields.name;
	if (fields.note !== undefined) nextFields.note = fields.note;

	return nextFields;
}

function toItemError(error: TStoredItemError): IItemError {
	return {
		messages: error.messages,
		fields: toItemErrorFields(error.fields),
	};
}

export function toItem(item: TStoredItem): IItem {
	if (item.error === undefined) {
		return {
			id: item.id,
			calculate: item.calculate,
			rarity: item.rarity,
			name: item.name,
			note: item.note,
			moduleFrom: item.moduleFrom,
			moduleTo: item.moduleTo,
			e1: item.e1,
			l1: item.l1,
			e2: item.e2,
			l2: item.l2,
		};
	}

	return {
		...item,
		error: toItemError(item.error),
	};
}
