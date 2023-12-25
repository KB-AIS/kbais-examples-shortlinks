import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src/server',
      '@/configuration': 'src/server/05_configuration',
    },
  },
});