module.exports = {
  purge: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        safecash: "url('/background v2.jpeg')",
      }),
      colors: {
        'main-blue': '#1B4180',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
