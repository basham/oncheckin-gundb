import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    target: 'esnext'
  },
  plugins: [
    svelte(),
    VitePWA({
      devOptions: {
        enabled: true,
        type: 'module'
      },
      filename: 'sw.js',
      injectManifest: {
        globPatterns: ['**/*.{css,html,js,svg}']
      },
      srcDir: 'src',
      strategies: 'injectManifest',
      workbox: {
      }
    })
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src')
    }
  }
});
