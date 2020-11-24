module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [ '@typescript-eslint' ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages', { js: 'never', jsx: 'never', ts: 'never', tsx: 'never', },
    ],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/array-type': ['warn', {default: 'generic'}],
    '@typescript-eslint/explicit-member-accessibility': ['error'],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-empty-interface': ['error'],
    '@typescript-eslint/prefer-readonly': ['warn'],
    '@typescript-eslint/no-inferrable-types': ['error'],
    'comma-dangle': ['error'],
    'indent': ['error', 2],
    'object-shorthand': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed'],
    'quotes': ['error', 'single'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-in-parens': ['error', 'never'],
    'no-tabs': ['error']
  },
};
