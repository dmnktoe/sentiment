const { defineConfig } = require('eslint/config');

const globals = require('globals');
const tseslint = require('typescript-eslint');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const unusedImports = require('eslint-plugin-unused-imports');
const { FlatCompat } = require('@eslint/eslintrc');
const eslintNext = require('eslint-config-next');

const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = defineConfig([
  ...eslintNext,
  ...tseslint.configs.recommended, // bringt Plugin + Rules mit
  ...compat.extends('prettier', 'plugin:prettier/recommended'),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: true,
        JSX: true,
      },
    },

    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },

    rules: {
      'no-unused-vars': 'off',
      'no-console': 'warn',
      'no-multi-spaces': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'object-curly-spacing': ['warn', 'always'],
      quotes: ['warn', 'single', { avoidEscape: true }],

      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never' },
      ],

      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^@?\\w', '^\\u0000'],
            ['^.+\\.s?css$'],
            ['^@/lib', '^@/hooks'],
            ['^@/data'],
            ['^@/components', '^@/container'],
            ['^@/store'],
            ['^@/'],
            [
              '^\\./?$',
              '^\\.(?!/?$)',
              '^\\.\\./?$',
              '^\\.\\.(?!/?$)',
              '^\\.\\./\\.\\./?$',
              '^\\.\\./\\.\\.(?!/?$)',
              '^\\.\\./\\.\\./\\.\\./?$',
              '^\\.\\./\\.\\./\\.\\.(?!/?$)',
            ],
            ['^@/types'],
            ['^'],
          ],
        },
      ],
    },
  },
]);
