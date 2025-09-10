/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'garja-black': '#000000',
        'garja-gray': '#6B7280',
        'garja-light-gray': '#F3F4F6',
      },
    },
  },
  plugins: [],
}
