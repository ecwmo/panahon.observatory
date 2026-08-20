import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

import mkcert from 'vite-plugin-mkcert'

import UnoCSS from 'unocss/astro'

import node from '@astrojs/node'
import vue from '@astrojs/vue'
import AstroPWA from '@vite-pwa/astro'

const mode = process.env.NODE_ENV ?? 'development'

const { APP_HOST, APP_PORT, APP_SITE, APP_BASE } = loadEnv(mode, process.cwd(), '')

const basePath = `${(APP_BASE ?? '/').replace(/\/$/, '')}/`

export default defineConfig({
  output: 'server',
  server:
    mode === 'production'
      ? undefined
      : {
          host: APP_HOST,
          port: Number(APP_PORT ?? 8080),
        },
  site: APP_SITE,
  base: basePath,
  security: {
    checkOrigin: false,
  },
  integrations: [
    vue({ appEntrypoint: '/src/pages/_app' }),
    UnoCSS(),
    AstroPWA({
      registerType: 'autoUpdate',
      base: basePath,
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Manila Observatory - Panahon',
        short_name: 'MO - Panahon',
        theme_color: '#ffffff',
        description: 'Manila Observatory - Panahon website',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      pwaAssets: {
        config: true,
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\/$/],
      },
    }),
  ],
  vite: {
    plugins: [mkcert()],
    server: {
      proxy: {
        '/panahon': {
          target: 'https://panahon.observatory.ph',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/panahon/, ''),
        },
      },
    },
  },
  adapter: node({
    mode: 'standalone',
  }),
})
