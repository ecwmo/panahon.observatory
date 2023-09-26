import { defineConfig } from 'unocss'

import presetIcons from '@unocss/preset-icons'
import presetWind from '@unocss/preset-wind'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [presetWind(), presetIcons()],
  transformers: [transformerDirectives()],
})
