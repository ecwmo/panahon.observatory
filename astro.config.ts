import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

import UnoCSS from 'unocss/astro'

import node from '@astrojs/node'
import partytown from '@astrojs/partytown'
import vue from '@astrojs/vue'
import AstroPWA from '@vite-pwa/astro'

import AutoImport from 'unplugin-auto-import/astro'
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

const { APP_HOST, APP_PORT, APP_SITE, APP_BASE } = loadEnv(process.env.NODE_ENV, process.cwd(), '')

const basePath = `${(APP_BASE ?? '/').replace(/\/$/, '')}/`

export default defineConfig({
  output: 'server',
  server: {
    host: APP_HOST,
    port: +APP_PORT,
  },
  site: APP_SITE,
  base: basePath,
  integrations: [
    vue({ appEntrypoint: '/src/pages/_app' }),
    UnoCSS({
      injectReset: true,
    }),
    AstroPWA({
      registerType: 'autoUpdate',
      base: basePath,
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Manila Observatory - Panahon',
        short_name: 'MO - Panahon',
        background_color: '#ffffff',
        description: 'Manila Observatory - Panahon website',
        theme_color: '#ffffff',
        icons: [
          {
            src: `${basePath}resources/static/img/logo/android-chrome-192x192.png`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${basePath}resources/static/img/logo/android-chrome-512x512.png`,
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: `${basePath}resources/static/img/logo/android-chrome-512x512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    partytown({
      // Adds dataLayer.push as a forwarding-event.
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    AutoImport({
      imports: [
        'vue',
        {
          axios: [['default', 'axios']],
          'mapbox-gl': [['default', 'mapbox']],
          'chroma-js': [['default', 'chroma']],
          '@vueuse/core': ['useSwipe', 'useScroll', 'useIntersectionObserver', 'useGeolocation', 'useWindowSize'],
          '@tanstack/vue-query': ['useQuery', 'useInfiniteQuery'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables'],
      vueTemplate: true,
    }),
  ],
  vite: {
    build: {
      copyPublicDir: false,
    },
    plugins: [
      Components({
        resolvers: [HeadlessUiResolver()],
        dts: 'src/components.d.ts',
        directoryAsNamespace: true,
      }),
    ],
  },
  adapter: node({
    mode: 'standalone',
  }),
})
