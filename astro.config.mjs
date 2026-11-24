import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  output: 'static',
  adapter: node({
    mode: 'standalone',
  }),
  security: {
    checkOrigin: false,
  },
  site: 'https://ihre-domain.de',
  trailingSlash: 'never',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/test') })],
});
