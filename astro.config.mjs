// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: node({
		mode: 'standalone'
	}),
	site: 'https://example.com',
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
