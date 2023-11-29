module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				blue: '#3866F6',
				black: '#23262F',
				gray: '#D9D9D9',
			},
		},
	},
	darkMode: 'class',
	plugins: [require('tailwindcss-safe-area')],
}
