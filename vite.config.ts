import { defineConfig } from 'vite-plus'

export default defineConfig({
  fmt: {
    "semi": false,
    "singleQuote": true,
    "sortImports": true,
    "sortPackageJson": true
  },
  lint: {
    "categories": {
      "correctness": "error",
      "suspicious": "error",
      "pedantic": "off",
      "perf": "error",
      "style": "off",
      "restriction": "off",
      "nursery": "off",
    },
    overrides: [
      {
        files: ['src/**/rest-path.ts'],
        rules: {
          "no-underscore-dangle": "off",
        }
      },
    ],
  },
  pack: {
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
  },
})
