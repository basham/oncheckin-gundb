import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].js'
      }
    },
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
    })
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src')
    }
  }
});
