/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        custom: '0px 4px 10px 0px #145049',
        green: '0px 1px 10px 0px rgba(155, 159, 137, 0.40)'
      },
      animation: {
        blink: 'blink 1.5s infinite'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
