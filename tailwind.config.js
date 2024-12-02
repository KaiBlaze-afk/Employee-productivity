/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ole: ['"Ole"', 'cursive'],
      },
      fontWeight: {
        'ole-regular': 400,
      },
      fontStyle: {
        'ole-normal': 'normal',
      },
    },
  },
  plugins: [],
}