/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

           keyframes: {
        moveAround: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(50px, -50px)' },
          '50%': { transform: 'translate(-50px, 50px)' },
          '75%': { transform: 'translate(50px, 50px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
      },
      animation: {
        moveAround: 'moveAround 15s infinite alternate ease-in-out',
      },
      colors: {
        primary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
      },
    },
  },
  plugins: [],
}

  

