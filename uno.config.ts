import { defineConfig, presetWind3, presetIcons, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
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
