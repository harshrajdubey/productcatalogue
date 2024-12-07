/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Include HTML files
    "./src/**/*.{js,jsx,ts,tsx}", // Include JSX/TSX files in the src folder
  ],
  darkMode: 'class', // Enable dark mode using the 'class' strategy
  theme: {
    extend: {},
  },
  plugins: [],
};
