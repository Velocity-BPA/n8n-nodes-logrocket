module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'n8n-nodes-base'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:n8n-nodes-base/community',
    'prettier',
  ],
  env: {
    node: true,
    es2020: true,
  },
  ignorePatterns: [
    'dist/**/*',
    'node_modules/**/*',
    'test/**/*',
    '*.js',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'n8n-nodes-base/node-param-description-boolean-without-whether': 'off',
    'n8n-nodes-base/node-param-description-miscased-json': 'off',
    'n8n-nodes-base/node-param-description-wrong-for-return-all': 'off',
    'n8n-nodes-base/node-param-description-wrong-for-limit': 'off',
    'n8n-nodes-base/node-param-description-wrong-for-simplify': 'off',
  },
};
