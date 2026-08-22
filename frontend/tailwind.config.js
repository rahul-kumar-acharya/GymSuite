/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F7F3ED',
          200: '#EFE8DE',
        },
        espresso: {
          500: '#52433A',
          800: '#3B302A',
          900: '#2A221D',
        },
        warm: {
          500: '#6B5143',
          600: '#594337',
        },
        brass: {
          400: '#C5A36B',
          500: '#B08D57',
          600: '#997845',
        },
        charcoal: '#292522',
        sand: '#E6DED4',
        mutedGray: '#817A73',
        statusGreen: {
          bg: '#E8F0EA',
          text: '#2C5E3B'
        },
        statusAmber: {
          bg: '#FAF3E8',
          text: '#8F6126'
        },
        statusRed: {
          bg: '#F8ECEC',
          text: '#8C3A3A'
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
