# Asset scripts

Both outputs are committed to `web/public/`; rerun only when the logo or tagline changes.

**Favicons and app icons** (`favicon.ico`, 16/32 px PNGs, `apple-touch-icon.png`, 192/512 and maskable icons):

```bash
node scripts/make-icons.mjs
```

It crops the circular RH emblem from `web/src/assets/logo-wordmark-chocolate.png`, recolors it ivory on terracotta, and thickens the lines for the tab sizes.

**Share banner** (`web/public/og.png`, 1200 x 630, used for Facebook, Twitter/X, iMessage and Slack previews):

1. `pnpm dev`, then open `http://localhost:4321/dev/og/` (a dev-only page, not part of the production build).
2. Make the browser window exactly 1200 x 630 and screenshot the page into `web/public/og.png`.
