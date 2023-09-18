const tsRules = {
	// TypeScript would check it on its own
	indent: ['warn', 'tab'],
	'comma-dangle': [
		'warn',
		{
			arrays: 'never',
			objects: 'always',
			imports: 'always',
			exports: 'always',
			functions: 'never',
		}
	],
	quotes: ['warn', 'single'],
	'array-callback-return': 'off',
	'func-style': ['warn', 'declaration'],
	'guard-for-in': 'off',
	'max-len': 'off',
	'no-await-in-loop': 'off',
	'no-fallthrough': 'off',
	'no-param-reassign': 'warn',
	'no-plusplus': 'off',
	'no-restricted-syntax': 'off',
	'no-return-await': 'off',
	'require-await': 'off',
	'@typescript-eslint/ban-types': 'warn',
	'@typescript-eslint/no-var-requires': 'warn',
	'@hapi/hapi/scope-start': 'off',
	'@hapi/hapi/for-loop': 'off',
};

module.exports = {
	root: true,
	ignorePatterns: ['node_modules/', 'test', '*.d.ts'],
	parserOptions: {
		ecmaVersion: 2021,
		project: ['./tsconfig.json'],
		extraFileExtensions: ['.cjs'],
	},
	extends: ['eslint:recommended', 'prettier'],
	rules: tsRules,
	overrides: [
		{
			files: ['*.js', '*.cjs', '*.mjs'],
			env: {
				node: true,
			},
		},
		{
			files: ['*.ts'],
			parser: '@typescript-eslint/parser',
			extends: [
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:security/recommended'
			],
			env: {
				node: true,
			},
		}
		// {
		// 	files: ['*.spec.ts', '*.test.ts', '*.try.ts'],
		// 	extends: ['plugin:jest/recommended', 'plugin:jest/style'],
		// }
	],
};
