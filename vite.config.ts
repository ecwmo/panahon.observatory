import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: 'src/main.ts',
      manualChunks: {
        mapboxgl: ['mapbox-gl'],
        datefns: ['date-fns'],
        fa: ['@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons', '@fortawesome/vue-fontawesome'],
      },
    },
  },
  plugins: [
    vue(),
    Pages({
      importMode: 'async',
      extendRoute(route, parent) {
        if (route.path === '/newreport') {
          return {
            ...route,
            meta: { requiresAuth: true },
          }
        }
        return route
      },
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables', 'src/store'],
      vueTemplate: true,
    }),
    Components({ dts: 'src/components.d.ts', directoryAsNamespace: true }),
    VitePWA(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
})
