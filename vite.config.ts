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
      pedantic: 'off',
      perf: 'error',
      style: 'off',
      restriction: 'off',
      nursery: 'off',
    },
    overrides: [
      {
        files: ['src/**/rest-path.ts'],
        rules: {
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
