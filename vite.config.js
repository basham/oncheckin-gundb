import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    svelte()
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src')
    }
  }
});
