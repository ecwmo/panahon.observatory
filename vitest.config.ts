/// <reference types="vitest" />
import { getViteConfig } from 'astro/config'

import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

export default getViteConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        {
          '@vueuse/core': ['useSwipe', 'useScroll', 'useIntersectionObserver', 'useGeolocation', 'useWindowSize'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables'],
      vueTemplate: true,
    }),
    Components({
      resolvers: [HeadlessUiResolver(), IconsResolver()],
      dts: 'src/components.d.ts',
      directoryAsNamespace: true,
    }),
    Icons({}),
  ],
})
