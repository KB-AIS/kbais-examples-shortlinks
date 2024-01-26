module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/stylistic',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    rules: {
        'quotes': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/quotes': ['error', 'single'],
        '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    },
};
