/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B2C', // Using the orange from the Figma design
        secondary: '#2B3970', // Using the dark blue from the Figma design
      }
    },
  },
  plugins: [],
}
