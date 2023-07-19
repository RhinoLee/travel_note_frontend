/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        custom: '0px 4px 10px 0px #145049'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
