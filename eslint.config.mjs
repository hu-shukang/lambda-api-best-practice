import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      'eslint.config.mjs',
      'prettier.config.mjs',
      'dist/**/*',
      'node_modules/**/*',
      '**/*swagger.plugin.ts',
      '**/migrations/**/*',
      '**/tests/**/*',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
]);
