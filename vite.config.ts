import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.APP_ENV === 'development' ? '/' : '/dist/',
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
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Manila Observatory - Panahon',
        short_name: 'MO - Panahon',
        background_color: '#ffffff',
        description: 'Manila Observatory - Panahon website',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/resources/static/img/logo/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/resources/static/img/logo/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/resources/static/img/logo/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
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
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
})
