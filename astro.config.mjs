import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://effervescent-chebakia-6a45c4.netlify.app',
  integrations: [sitemap()],
});
