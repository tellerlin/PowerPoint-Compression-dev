/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: 'var(--color-primary)',
				'primary-dark': 'var(--color-primary-dark)',
				secondary: 'var(--color-secondary)',
				'secondary-dark': 'var(--color-secondary-dark)',
				text: 'var(--color-text)',
				'text-light': 'var(--color-text-light)',
				background: 'var(--color-background)',
				'background-alt': 'var(--color-background-alt)'
			}
		}
	},
	plugins: []
};