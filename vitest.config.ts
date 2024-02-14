/// <reference types="vitest" />
import { defineConfig } from 'vite'

import Vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  plugins: [Vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
