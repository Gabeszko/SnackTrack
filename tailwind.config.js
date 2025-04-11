/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}", // JSX helyett TSX
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#bbeeff",
          200: "#99ccff",
          300: "#77aaff",
          400: "#5588ff",
          500: "#3366ff",
        },
      },
    },
  },
  plugins: [],
}
