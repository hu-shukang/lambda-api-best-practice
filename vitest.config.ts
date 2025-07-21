import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/test/**',
        '**/cdk/**',
        '**/cdk.out/**',
        'eslint.config.mjs',
        'prettier.config.mjs',
        'vitest.config.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './test'),
    },
  },
});
