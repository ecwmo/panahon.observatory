import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

import mkcert from 'vite-plugin-mkcert'

import UnoCSS from 'unocss/astro'

import node from '@astrojs/node'
import vue from '@astrojs/vue'
import AstroPWA from '@vite-pwa/astro'

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
  ],
  vite: {
    build: {
      copyPublicDir: false,
    },
    plugins: [mkcert()],
  },
  adapter: node({
    mode: 'standalone',
  }),
})
