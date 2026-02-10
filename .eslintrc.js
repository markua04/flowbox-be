module.exports = {
	"env": {
		"commonjs": true,
		"es2021": true,
		"node": true
	},
	"ignorePatterns": ["**/*.js"],
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"overrides": [
		{
			"files": ["**/*.ts", "**/*.tsx"]
		},
		{
			"files": ["src/repositories/db.ts"],
			"rules": {
				"no-invalid-this": "off"
			}
		}
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest"
	},
	"plugins": [
		"@typescript-eslint"
	],
	"rules": {
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": ["error"],
		"indent": "off",
		"@typescript-eslint/indent": ["error", "tab"],
		"@typescript-eslint/ban-ts-ignore": "off",
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"never"
		],
		"comma-dangle": [
			"error",
			"only-multiline"
		],
		"@typescript-eslint/no-explicit-any": 0,
		"camelcase": ["error", {"properties": "never"}],
		"@typescript-eslint/camelcase": "off",
		"no-const-assign": "error",
		"no-constant-binary-expression": "error",
		"no-constructor-return": "error",
		"no-dupe-else-if": "error",
		"no-dupe-keys": "error",
		"no-dupe-class-members": "error",
		"no-dupe-args": "error",
		"no-duplicate-case": "error",
		"no-duplicate-imports": "error",
		"no-empty-pattern": "error",
		"no-func-assign": "error",
		"no-invalid-regexp": "error",
		"no-unreachable-loop": "error",
		"no-unreachable": "error",
		"no-use-before-define": "error",
		"use-isnan": "error",
		"valid-typeof": "error",
		"block-scoped-var": "error",
		"capitalized-comments": "warn",
		"default-case-last": "warn",
		"max-depth": ["warn", 5],
		"no-invalid-this": "error",
		"no-var": "warn"
	}
}
