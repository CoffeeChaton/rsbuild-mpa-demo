import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintReact from "@eslint-react/eslint-plugin";

export default defineConfig([
	globalIgnores(["dist", ".vscode"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
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
					message: "[CustomRules_01] Do not use `in`; use shared key sets, explicit helper functions, or Object.hasOwn for own-property checks.",
				},
				{
					selector: "TSAsExpression:not([typeAnnotation.type='TSTypeReference'][typeAnnotation.typeName.name='const'])",
					message: "[CustomRules_02] Do not use `as` assertions here; prefer narrowing, helper functions, or typed intermediate values. `as const` is the only allowed exception.",
				},
				{
					selector: "TSTypeAssertion",
					message: "[CustomRules_03] Do not use angle-bracket type assertions; prefer narrowing, helper functions, or typed intermediate values.",
				},
			],
		},
	},
]);
