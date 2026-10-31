/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'apple': '0 10px 30px -5px rgba(15, 23, 42, 0.06), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'apple-lg': '0 24px 48px -12px rgba(15, 23, 42, 0.12), 0 8px 20px -4px rgba(15, 23, 42, 0.06)',
        'apple-hover': '0 20px 40px -10px rgba(79, 70, 229, 0.15), 0 8px 16px -4px rgba(15, 23, 42, 0.06)',
      }
    },
  },
  plugins: [],
}
