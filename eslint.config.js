/**
File: eslint.config.js
Purpose: Flat ESLint config for Bun; unblock CI by configuring env/globals/ignores and per-file overrides
Inputs: n/a
Outputs: lint rules config
Usage: used by ESLint when run via Bun
Owner: engineering
Last-Updated: 2025-08-09
*/

#!/usr/bin/env node

import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'legacy-v1/',
      '_deprecated_src/',
      'archive/tools-archived/vrite/',
      '/node_modules/',
      '/dist/',
      '/build/',
      '/.expo/',
      '/android/',
      '/ios/',
      '/.d.ts',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { project: false },
      globals: {
        module: 'readonly',
        exports: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-sparse-arrays': 'error',
      '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-expect-error': 'allow-with-description' }],
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },

  // Node/Metro/config scripts and entry points often need CommonJS + globals
  {
    files: [
      'metro.config.*',
      '*.cjs',
      '*.config.*',
      'eslint-local-rules.cjs',
      'enforce-error-logger.cjs',
      'preinstall-check.js',
      'index.android.js',
      'index.js',
    ],
    languageOptions: { sourceType: 'script' },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },
];
