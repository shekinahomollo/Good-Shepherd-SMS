/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sky:   { DEFAULT: '#A8DADC', dark: '#7bc5c8' },
        ocean: { DEFAULT: '#457B9D', dark: '#2c5f7a', light: '#d6e9f3' },
        cream: '#F1FAEE',
        gold:  { DEFAULT: '#F1C40F', dark: '#c9a80c' },
        teal:  { DEFAULT: '#2A9D8F', dark: '#1e7268' },
      },
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        body:    ['Quicksand', 'sans-serif'],
      },
      borderRadius: {
        sms:    '14px',
        'sms-lg': '20px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}