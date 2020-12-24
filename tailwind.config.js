module.exports = {
	purge: [
		'./docs/**/*.jsx',
		'./docs/**/*.js',
		'./docs/**/*.html',
		'./packages/**/*.jsx',
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/forms'),
	],
};
