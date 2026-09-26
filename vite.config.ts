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
      "pedantic": "warn",
      "perf": "error",
      "style": "warn",
      "restriction": "warn",
      "nursery": "off",
    },
  },
  pack: {
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
  },
})
