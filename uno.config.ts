import { defineConfig } from 'unocss'

import presetIcons from '@unocss/preset-icons'
import presetWind from '@unocss/preset-wind'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [
    presetWind(),
    presetIcons({
      customizations: {
        iconCustomizer(collection, icon, props) {
          if (collection === 'wi' && icon === 'barometer') {
            props.width = '1.1em'
            props.height = '1.1em'
            props.viewBox = '5 5 20 20'
          }
        },
      },
    }),
  ],
  transformers: [transformerDirectives()],
})
