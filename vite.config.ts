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
      style: 'warn',
      restriction: 'warn',
      nursery: 'off',
    },
    rules: {
      // pedantic
      'max-depth': ['warn', { max: 5 }],
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'no-inline-comments': 'off',
      'no-useless-undefined': 'off',
      'one-var': 'off',
      'require-unicode-regexp': 'off', // temporary
      'typescript/ban-types': 'off',
      'unicorn/no-array-callback-reference': 'off',
      // style
      'capitalized-comments': 'off',
      curly: ['off', 'multi-line', 'consistent'],
      'id-length': 'off',
      'max-params': ['warn', { max: 5 }],
      'max-statements': 'off',
      'no-magic-numbers': 'off',
      'no-nested-ternary': 'off',
      'no-ternary': 'off',
      'sort-imports': 'off', // Delegated to fmt
      'sort-keys': 'off', // Too broad
      'typescript/consistent-indexed-object-style': 'off',
      'typescript/method-signature-style': ['warn', 'method'],
      'typescript/no-empty-interface': 'off',
      'typescript/unified-signatures': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-null': 'off',
      'unicorn/number-literal-case': 'off', // May conflict with fmt
      'unicorn/switch-case-braces': ['warn', 'avoid'],
      // restriction
      'default-case': 'off', // For concise coding
      'no-bitwise': 'off',
      'no-console': ['warn', { allow: ['assert', 'error', 'info', 'warn'] }],
      'no-plusplus': 'off',
      'no-undefined': 'off',
      'oxc/no-async-await': 'off', // ???
      'oxc/no-optional-chaining': 'off',
      'oxc/no-rest-spread-properties': 'off',
      'typescript/explicit-function-return-type': 'off', // temporary
      'typescript/explicit-member-accessibility': 'off',
      'typescript/explicit-module-boundary-types': 'off', // temporary
      'typescript/no-empty-object-type': 'off',
      'typescript/no-explicit-any': 'off', // temporary
    },
    overrides: [
      {
        files: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
        rules: {
          'init-declarations': 'off',
          'no-proto': 'off',
          'typescript/ban-ts-comment': 'off',
          'unicorn/max-nested-calls': 'off',
        },
      },
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
