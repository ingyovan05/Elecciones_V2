/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e7f2ff',
          100: '#c3ddff',
          200: '#9ec7ff',
          300: '#79b1ff',
          400: '#559bff',
          500: '#3b82f6',
          600: '#2a62c4',
          700: '#1b4391',
          800: '#0c255f',
          900: '#01062e'
        }
      }
    },
  },
  plugins: [],
}
