import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { portfolioSeo } from './scripts/seo.mjs';
export default defineConfig({
    plugins: [react(), portfolioSeo()],
});
