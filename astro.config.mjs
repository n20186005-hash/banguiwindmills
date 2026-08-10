import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { siteConfig } from './src/config';

const hasSite = !!siteConfig.baseUrl;

// https://astro.build/config
export default defineConfig({
  ...(hasSite ? { site: siteConfig.baseUrl } : {}),
  trailingSlash: 'ignore',
  integrations: hasSite ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
