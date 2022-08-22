import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext'
  },
  plugins: [
    svelte()
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src')
    }
  }
});
