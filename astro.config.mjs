// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Vex',
			description: 'A compiled, statically typed language for building truly native mobile apps.',
			logo: {
				light: './src/assets/vex-lockup-light.svg',
				dark: './src/assets/vex-lockup-dark.svg',
				replacesTitle: true,
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/irshadio/vex-lang' }],
			editLink: { baseUrl: 'https://github.com/irshadio/vex-website/edit/main/' },
			sidebar: [
				{
					label: 'Get started',
					items: [
						{ label: 'Overview', slug: 'get-started/overview' },
						{ label: 'Install', slug: 'get-started/install' },
					],
				},
			],
		}),
	],
});
