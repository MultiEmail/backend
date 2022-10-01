module.exports = {
	"env": {
		"es2021": true,
		"node": true,
		"jest": true
	},
	"parser": "@typescript-eslint/parser",
	"plugins": [
		"@typescript-eslint",
		"prettier",
		"sonarjs",
		"no-secrets",
		"jsonc",
		"pii",
		"no-unsanitized"
	],
	"extends": [
		"google",
		"prettier",
		"plugin:sonarjs/recommended",
		"plugin:node/recommended",
		"plugin:jsonc/base",
		"plugin:pii/recommended",
		"plugin:no-unsanitized/DOM",
		"plugin:prettier/recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"parserOptions": {
		"ecmaVersion": 2020,
		"sourceType": "module"
	},
	"settings": {
		"import/resolver": {
			"typescript": {}
		}
	},
	"rules": {
		"semi": "error",
		"no-console": "warn",
		"no-tabs": "off",
		"indent": "off",
		"space-infix-ops": "off",
		"no-trailing-spaces": "error",
		"space-before-blocks": "error",
		"quotes": "off",
		"camelcase": "error",
		"node/no-unpublished-import": "off",
		"node/no-unsupported-features/es-syntax": "off",
		"node/no-missing-import": [
			"error",
			{
				"allowModules": [],
				"resolvePaths": ["/path/to/a/modules/directory"],
				"tryExtensions": [".js", ".ts", ".json", ".node"]
			}
		],
		"valid-jsdoc": "off",
		"node/handle-callback-err": "error",
		"node/no-path-concat": "error",
		"node/no-process-exit": "error",
		"node/global-require": "error",
		"node/no-sync": "error",
		"no-secrets/no-secrets": "error",
		"pii/no-email": "off",
		"no-invalid-this": "off",
		"spaced-comment": "off",
		"prefer-destructuring": ["error", { "object": true, "array": true }],
		"@typescript-eslint/no-explicit-any": "off",
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{ "argsIgnorePattern": "req|res", "varsIgnorePattern": "prop" }
		],
		"@typescript-eslint/ban-types": [
			"error",
			{
				"types": {
					// un-ban a type that's banned by default
					"{}": false
				},
				"extendDefaults": true
			}
		],
		"linebreak-style": "off",
		"object-curly-spacing": "off",
		"comma-dangle": "off",
		"new-cap": "off",
		"require-await": "error",
		"require-jsdoc": "off",
		"sonarjs/cognitive-complexity": "off",
		"sonarjs/no-duplicate-string": "off",
		"sonarjs/no-identical-expressions": "off",
		"sonarjs/no-identical-functions": "off",
		"@typescript-eslint/quotes": ["error", "double"],
		"@typescript-eslint/explicit-function-return-type": "off",
		"prettier/prettier": [
			"error",
			{
				"endOfLine": "auto",
				"useTabs": true
			}
		]
	}
}