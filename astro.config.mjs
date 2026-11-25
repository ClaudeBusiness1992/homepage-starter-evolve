import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  security: {
    checkOrigin: false,
  },
  site: 'https://homepage-starter-evolve.vercel.app',
  trailingSlash: 'never',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/test') })],
});
