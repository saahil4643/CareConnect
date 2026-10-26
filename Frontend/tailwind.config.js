/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e5ece5',
          200: '#cddbcd',
          300: '#a8c2a8',
          400: '#7fa37f',
          500: '#5e855e',
          600: '#486948',
          700: '#3a533a',
          800: '#304330',
          900: '#283728',
        },
        warm: {
          50: '#faf9f6',
          100: '#f5f3ee',
          200: '#ebe6dd',
          300: '#ddd4c5',
          400: '#cbbda7',
          500: '#b8a38a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
