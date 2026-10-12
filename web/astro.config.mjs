// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Staging (GitHub Pages) sets SITE_URL + BASE_PATH in CI; the permanent host
// only needs those two values changed, nothing else.
const site = process.env.SITE_URL ?? 'http://localhost:4321';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/styleguide/') })],
});
