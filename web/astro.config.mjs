// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The deploy workflow sets SITE_URL + BASE_PATH from GitHub's Pages settings (staging sub-path, or the custom
// domain at the root); other hosts only need those two values.
const site = process.env.SITE_URL ?? 'http://localhost:4321';
const base = process.env.BASE_PATH ?? '/';
// Redirect targets are not prefixed with the base automatically, so add it here.
const to = (/** @type {string} */ path) => `${base.replace(/\/$/, '')}${path}`;

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  // Fetch a page as soon as the pointer rests on (or keyboard focus reaches) a link to it, so the page change can
  // start the moment it is clicked. Astro skips this on slow connections and when data saver is on.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // Pages merged away in the October 2026 simplification; old links land on the page that now holds the content.
  redirects: {
    '/about': to('/team/'),
    '/directions': to('/contact/'),
    '/faq': to('/contact/'),
    '/reviews': to('/'),
    '/styleguide': to('/'),
  },
});
