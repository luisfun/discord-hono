import { defineConfig } from 'vite-plus'

export default defineConfig({
  fmt: {
    printWidth: 120,
    semi: false,
    singleQuote: true,
    arrowParens: 'avoid',
    sortImports: true,
    sortPackageJson: true,
    ignorePatterns: ['src/**/rest-types.ts'],
  },
  lint: {
    categories: {
      correctness: 'error',
      suspicious: 'error',
      pedantic: 'warn',
      perf: 'error',
      style: 'off',
      restriction: 'off',
      nursery: 'off',
    },
    rules: {
      'max-depth': ['warn', { max: 5 }],
      'max-lines': ['warn', { max: 1000 }],
      'max-lines-per-function': ['warn', { max: 100 }],
      'no-inline-comments': 'off',
      'no-useless-undefined': 'off',
      'require-unicode-regexp': 'off', // 要検討
      'typescript/ban-types': 'off',
      'unicorn/no-array-callback-reference': 'off',
    },
    overrides: [
      {
        files: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
        rules: {
          'max-lines-per-function': 'off',
          'typescript/ban-ts-comment': 'off',
        },
      },
      {
        files: ['src/rest/**/*.ts'],
        rules: {
          'max-lines': 'off',
          'no-underscore-dangle': 'off',
        },
      },
    ],
  },
  test: {
    coverage: {
      include: ['src/**'],
      reporter: ['html', 'json'],
    },
  },
  pack: {
    format: ['esm'],
    dts: true,
    clean: true,
  },
})
