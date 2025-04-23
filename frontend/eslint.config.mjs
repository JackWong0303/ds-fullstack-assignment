import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginQuery from '@tanstack/eslint-plugin-query';

import {defineConfig} from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {js},
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {globals: globals.browser},
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginQuery.configs.flat.recommended,
]);
