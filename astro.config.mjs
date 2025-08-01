// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: vercel({
		webAnalytics: { enabled: true }
	}),
	site: 'https://cyan-chasm.vercel.app',
	integrations: [
		mdx(),
		sitemap({
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
		}),
	],

	// Configurações de desenvolvimento
	server: {
		port: 4321,
		host: true,
	},

	// Configurações de markdown
	markdown: {
		shikiConfig: {
			theme: 'github-dark',
			wrap: true,
		},
		gfm: true,
	},
});
