const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html', './**/*.php', './**/*.vue'],
  theme: {
    extend: {
      textColor: {
        skin: {
          base: colors.gray['200'],
          inverted: colors.gray['900'],
          'muted-inv': colors.blue['500'],
          link: colors.blue['600'],
          'link-active': colors.blue['400'],
          button: colors.gray['200'],
          'button-active': colors.gray['900'],
          'button-accent': colors.gray['500'],
          'header-link': colors.gray['500'],
          'header-link-active': colors.gray['900'],
          'header-link-accent': colors.blue['500'],
          'listbox-active': colors.blue['700'],
        },
      },
      backgroundColor: {
        skin: {
          'header-fill': colors.white,
          'body-fill': colors.gray['700'],
          'body-fill-inv': colors.white,
          button: colors.gray['500'],
          'button-active': colors.gray['200'],
          'button-accent': colors.gray['200'],
          'listbox-active': colors.blue['100'],
          'popup-fill': colors.gray['500'],
        },
      },
      fill: {
        skin: {
          body: colors.gray['700'],
          base: colors.gray['500'],
        },
      },
    },
  },
  plugins: [],
}
