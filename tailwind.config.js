module.exports = {
	purge: [
		'./demo/**/*.jsx',
		'./demo/**/*.js',
		'./demo/**/*.html',
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
