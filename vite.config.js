import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const _dirname = typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '' : '/public/build/',
  publicDir: false,
  build: {
    manifest: true,
    outDir: 'public/build',
    rollupOptions: {
      input: 'src/main.ts',
    },
  },
  resolve: {
    alias: {
      '@': resolve(_dirname, './src'),
    },
  },
}))
