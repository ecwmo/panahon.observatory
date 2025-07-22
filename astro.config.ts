import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

import mkcert from 'vite-plugin-mkcert'

import UnoCSS from 'unocss/astro'

import node from '@astrojs/node'
import vue from '@astrojs/vue'
import AstroPWA from '@vite-pwa/astro'

const { APP_HOST, APP_PORT, APP_SITE, APP_BASE } = loadEnv(process.env.NODE_ENV, process.cwd(), '') //will read from .env file regardless of env file type

const basePath = `${(APP_BASE ?? '/').replace(/\/$/, '')}/` //normalizes the APP_BASE variable into basePath

export default defineConfig({
  output: 'server',
  server: {
    //specify server host and port
    host: APP_HOST,
    port: +APP_PORT,
  },
  site: APP_SITE, //app site url
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
    build: {
      copyPublicDir: false,
    },
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
