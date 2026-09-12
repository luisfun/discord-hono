import { defineConfig } from 'vitest/config'

// biome-ignore lint/style/noDefaultExport: Allow default export for Vitest configuration
export default defineConfig({
  test: {
    coverage: {
      include: ['src/**'],
      reporter: ['html', 'json'],
    },
  },
})
