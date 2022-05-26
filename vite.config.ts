import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: 'src/main.ts',
    },
  },
  plugins: [vue(), VitePWA(), Components({ dts: 'src/components.d.ts', directoryAsNamespace: true })],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  optimizeDeps: {
    include: ['axios', 'vue'],
  },
})
