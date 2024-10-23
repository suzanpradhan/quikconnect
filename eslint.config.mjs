import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  prettier, //  this line to disable ESLint rules that conflict with Prettier
  {
    plugins: {
      prettier: prettierPlugin, // Add the Prettier plugin
    },
    rules: {
      'prettier/prettier': 'error', // Enforce Prettier formatting rules as ESLint errors
    },
  },
];
