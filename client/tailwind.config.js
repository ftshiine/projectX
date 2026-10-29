/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#FFF8F7',
          100: '#F5E4E5',
          200: '#E8DFDF',
          600: '#BE123C',
          700: '#B44357',
          800: '#6A1326',
          900: '#5A1020',
          950: '#430B17',
        },
        blush: {
          50: '#FFF0F0',
          100: '#F9ECEF',
          200: '#FBEAEA',
          300: '#FFDADC',
        },
        ink: {
          900: '#161616',
          850: '#1A1416',
          800: '#0F172A',
          600: '#635D60',
          400: '#9CA3AF',
        },
        emerald: {
          700: '#15803D',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

