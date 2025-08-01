// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [
		mdx(),
		sitemap({
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
		}),
	],

	// Otimizações de performance
	build: {
		assets: 'assets',
		inlineStylesheets: 'auto',
	},

	// Otimizações de imagem
	image: {
		domains: ['example.com'],
		remotePatterns: [{ protocol: 'https' }],
	},

	// Compressão e otimização
	vite: {
		build: {
			cssCodeSplit: true,
			rollupOptions: {
				output: {
					assetFileNames: (assetInfo) => {
						let extType = assetInfo.name.split('.').at(1);
						if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
							extType = 'img';
						}
						return `assets/${extType}/[name]-[hash][extname]`;
					},
					chunkFileNames: 'assets/js/[name]-[hash].js',
					entryFileNames: 'assets/js/[name]-[hash].js',
				},
			},
		},
		css: {
			devSourcemap: true,
		},
	},

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
