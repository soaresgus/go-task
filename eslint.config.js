import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  // TypeScript (Angular)
  {
    files: ['**/*.ts'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@angular-eslint': angular,
      prettier: pluginPrettier,
      'unused-imports': unusedImports
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...angular.configs.recommended.rules,
      'prettier/prettier': 'error',
      'unused-imports/no-unused-imports': 'error'
    }
  },

  // HTML Templates
  {
    files: ['**/*.html'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      parser: angularTemplateParser
    },
    plugins: {
      '@angular-eslint/template': angularTemplate,
      prettier: pluginPrettier
    },
    rules: {
      ...angularTemplate.configs.recommended.rules,
      'prettier/prettier': ['error', { parser: 'angular' }]
    }
  }
];
