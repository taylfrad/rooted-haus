// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Staging (GitHub Pages) sets SITE_URL + BASE_PATH in CI; the permanent host
// only needs those two values changed, nothing else.
const site = process.env.SITE_URL ?? 'http://localhost:4321';
const base = process.env.BASE_PATH ?? '/';
// Redirect targets are not prefixed with the base automatically, so add it here.
const to = (/** @type {string} */ path) => `${base.replace(/\/$/, '')}${path}`;

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  // Pages merged away in the October 2026 simplification; old links land on the page that now holds the content.
  redirects: {
    '/about': to('/team/'),
    '/directions': to('/contact/'),
    '/faq': to('/contact/'),
    '/reviews': to('/'),
    '/styleguide': to('/'),
  },
});
