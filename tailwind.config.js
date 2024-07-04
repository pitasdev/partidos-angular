/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    screens: {
      'sm': { 'max': '576px' },
      'md': { 'max': '768px' },
      'lg': { 'max': '1024px' },
      'xl': { 'max': '1280px' }
    },
    extend: {}
  },
  plugins: []
}
