/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3866F6',
          text: '#3866F6',
          hover: '#3866F6',
        },
        blue: '#3866F6',
				black: '#23262F',
				gray: '#D9D9D9',
        white: '#FFFFFF',
      },
      fontFamily: {
        mincho: ['ShipporiMincho'],
      },
      fontWeight: {
        normal: '400',
        bold: '700',
        extrabold: '800',
      }
    },
  },
  plugins: [require("daisyui")],
}

