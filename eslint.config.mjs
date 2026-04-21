import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintReact from "@eslint-react/eslint-plugin";
import perfectionist from "eslint-plugin-perfectionist";

// oxlint-disable-next-line import/no-default-export
export default defineConfig([
	globalIgnores(["dist", ".vscode"]),

	{
		files: ["**/*.{ts,tsx}"],
		plugins: {
			perfectionist,
		},
		extends: [
			js.configs.recommended,
			tseslint.configs.recommendedTypeChecked,
			tseslint.configs.strictTypeChecked,
			tseslint.configs.stylisticTypeChecked,

			reactHooks.configs.flat["recommended-latest"],
			reactRefresh.configs.recommended,
			eslintReact.configs["recommended-typescript"],
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"@typescript-eslint/no-confusing-void-expression": "off",
			"@typescript-eslint/consistent-type-definitions": "off", // TODO
			"@typescript-eslint/restrict-template-expressions": [
				"warn",
				{
					"allowNumber": true,
				},
			],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-unnecessary-type-assertion": "error",
			"@typescript-eslint/no-use-before-define": ["warn", {
				functions: true,
				classes: true,
				variables: true,
				enums: true,
				typedefs: true,
				ignoreTypeReferences: false,
			}],
			"no-restricted-syntax": [
				"error",
				{
					selector: "BinaryExpression[operator='in']",
					message: "[CR01] 禁止使用 `in`；請改用共享 key set、明確的 helper 函式，或使用 Object.hasOwn 檢查自身屬性。",
				},
				{
					selector: "TSAsExpression:not([typeAnnotation.type='TSTypeReference'][typeAnnotation.typeName.name='const'])",
					message: "[CR02] 禁止使用 `as` 型別斷言,請改用型別收窄、helper 函式或中介變數。僅允許 `as const`。",
				},
				{
					selector: "TSTypeAssertion",
					message: "[CR03] 禁止使用尖括號型別斷言 <T> ,請改用型別收窄、helper 函式或中介變數。",
				},
				{
					selector: "ExportAllDeclaration",
					message: "[CR04] 禁止使用 `export * from`。",
				},
				{
					selector: "ImportNamespaceSpecifier[source.value^='./']",
					message: "[CR05] 本地模組禁止使用 `import *`。",
				},
			],
			//
			"perfectionist/sort-exports": ["error", { order: "asc", type: "natural" }],
			"perfectionist/sort-imports": ["error", {
				groups: [
					"type-import",
					["type-parent", "type-sibling", "type-index", "type-internal"],

					"value-builtin",
					"value-external",
					"value-internal",
					["value-parent", "value-sibling", "value-index"],
					"side-effect",
					"ts-equals-import",
					"unknown",
				],
				newlinesBetween: "ignore",
				newlinesInside: "ignore",
				order: "asc",
				type: "natural",
			}],
			"perfectionist/sort-named-exports": ["error", { order: "asc", type: "natural" }],
			"perfectionist/sort-named-imports": ["error", { order: "asc", type: "natural" }],
		},
	},
]);
