const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html', './**/*.php', './**/*.vue'],
  theme: {
    extend: {
      textColor: {
        skin: {
          base: colors.gray['900'],
          inverted: colors.blue['50'],
          'muted-inv': colors.blue['500'],
          link: colors.blue['600'],
          'link-active': colors.blue['400'],
          button: colors.blue['50'],
          'button-inv': colors.blue['900'],
          'button-accent': colors.amber['50'],
        },
      },
      backgroundColor: {
        skin: {
          'header-fill': colors.blue['900'],
          'body-fill': colors.gray['300'],
          button: colors.blue['900'],
          'button-inv': colors.blue['600'],
          'button-accent': colors.amber['300'],
        },
      },
    },
  },
  plugins: [],
}
