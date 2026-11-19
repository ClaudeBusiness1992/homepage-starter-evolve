import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  // Pro Kunde anpassen — wird für Sitemap, Canonical-URLs und OG-Tags benötigt
  site: 'https://ihre-domain.de',
  trailingSlash: 'never',
  // /test ist eine Testseite (noindex) und gehört nicht in die Sitemap.
  integrations: [sitemap({ filter: (page) => !page.endsWith('/test') })],
});
