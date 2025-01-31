import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	build: {
		commonjsOptions: {
			transformMixedEsModules: true
		},
		modulePreload: false,
		rollupOptions: {
			output: {
				entryFileNames: '[name].js',
			},
		},
		target: 'esnext',
	},
	plugins: [
		svelte({
			emitCss: false
		}),
		VitePWA({
			devOptions: {
				enabled: true,
				type: 'module',
			},
			filename: 'sw.js',
			injectManifest: {
				globPatterns: ['**/*.{css,html,js,png,svg}'],
			},
			injectRegister: 'inline',
			manifest: {
				name: 'OnCheckIn',
				short_name: 'OnCheckIn',
				description: 'Membership app for Hash House Harriers.',
				lang: 'en-US',
				display: 'standalone',
				background_color: '#27180a',
				theme_color: '#190f05',
				orientation: 'portrait',
				icons: [
					{
						src: 'icon-192.png',
						type: 'image/png',
						sizes: '192x192'
					},
					{
						src: 'icon-512.png',
						type: 'image/png',
						sizes: '512x512'
					},
					{
						src: 'icon.svg'
					}
				]
			},
			srcDir: 'src',
			strategies: 'injectManifest',
		}),
	],
	resolve: {
		alias: {
			'@src': path.resolve(__dirname, 'src'),
		},
	},
});
