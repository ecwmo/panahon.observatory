import { defineConfig, presetWind3, presetIcons, transformerDirectives } from 'unocss'
import presetWebFonts from '@unocss/preset-web-fonts' //for custom font handling
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'

export default defineConfig({
  presets: [
    presetWind3(), //Tailwind / Windi CSS preset
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
  theme: { //themes used grouped by component
    colors: {
      card: { //weather info cards
        "defaultBg":`#6b7280`, //gray-500
        "defaultHover":`#e5e7eb`, //gray-200
        "Dark":`#111827`, //gray-900
        "fake":`#e2e8f0`, //slate-200
        "Light": `#1f2937` //gray-800
      },
      navbar: { //navbar
        "Title":`#111827`, //gray-900
        "Subtitle":`#1f2937`, //gray-800
        "Gray":`#78716c`, //stone-500
        "Active":`#ffd479`, //blue-500
      },
      widgets: { //cloud, temp, wind, icons etc
        "Rain":`#2563eb`, //blue-600
        "Temp":`#dc2626`, //red-600
        "Wind":`#0891b2`, //cyan-600
        "Pres":`#d97706`, //amber-600
        "Default":`#57534e`, //stone-600
      },
      mo: { //standard Manila Observatory colors
        "Blue":`#22225d`
      }
    }
  },
  shortcuts: [
    {
      "new-navbar":`bg-gradient-to-r from-mo-Blue from-25% to-white to-65% shadow-lg px-2 md:px-6 py-2`,
    },
  ],
  rules: []
})

// // Syntax note:
// // [/^fancy-(.*)$/, ([, c]) => (
// //     {color: `${c}`, "text-decoration":`underline ${c}` }
// // )]