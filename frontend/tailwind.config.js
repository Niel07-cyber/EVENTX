/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: "#00A799",
        secondary: "#1F2937",
        surface: "#FFFFFF",
        background: "#F0F2F5",
      },
    },
  },
  plugins: [],
}
