// @ts-check

import { defineConfig } from '@vben/eslint-config';

export default defineConfig([
  {
    rules: {
      'no-console': 'off', // 完全关闭no-console规则
      // 或者允许更多console方法
      // 'no-console': ['error', { allow: ['warn', 'error', 'log', 'info'] }],
      '@typescript-eslint/no-implicit-any': 'error',
    },
  },
]);
