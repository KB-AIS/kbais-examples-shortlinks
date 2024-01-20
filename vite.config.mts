import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    resolve: {
        alias: {
            '~sl-core': '/src/core',
            '~sl-core.infra': '/src/core.infra',
            '~sl-modules': '/src/modules',
            '~sl-web': '/src/runners/web',
            '~sl-bot': '/src/runners/bot',
        },
    },
    plugins: [react()],
});