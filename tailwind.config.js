/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "poke-red": "#FF0000",
        "poke-blue": "#75C2F6",
        "poke-yellow": "#FFFF00",
        "poke-white": "#FFFFFF",
      },
    },
  },
  plugins: [],
};
