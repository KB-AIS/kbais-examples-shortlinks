import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '~sl-core': '/src/runners/web',

      '~sl-modules': '/src/runners/web',

      '~sl-web': '/src/runners/web',
      '~sl-bot': '/src/runners/web',
    },
  },
});