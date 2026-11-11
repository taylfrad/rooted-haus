# Asset scripts

Both outputs are committed to `web/public/`; rerun only when the logo or tagline changes.

**Favicons and app icons** (`favicon.ico`, 16/32 px PNGs, `apple-touch-icon.png`, 192/512 and maskable icons):

```bash
node scripts/make-icons.mjs
```

It crops the circular RH emblem from `web/src/assets/logo-wordmark-chocolate.png`, recolors it ivory on terracotta, and thickens the lines for the tab sizes.

**Share banner** (`web/public/og.png`, 1200 x 630, used for Facebook, Twitter/X, iMessage and Slack previews):

1. `pnpm dev`, so `http://localhost:4321/dev/og/` is being served (a dev-only page, not part of the production build).
2. Let Chrome take the picture at exactly 1200 x 630 (adjust the path to Chrome on a Mac or Linux machine):

   ```bash
   "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless --hide-scrollbars --window-size=1200,630 --virtual-time-budget=6000 --screenshot=web/public/og.png http://localhost:4321/dev/og/
   ```

**Photo shoot** (`web/src/assets/photos/{hero,stylists,rituals}/`):

The full-size originals live in `photos-originals/` at the repo root (gitignored; hundreds of MB). To add or replace photos,
drop the originals into the matching folder there and run:

```bash
node scripts/import-photos.mjs
```

It rotates each photo upright, resizes it to at most 2400 px on the long edge, saves it as a JPEG, and strips all camera
metadata (including any GPS location). Output file names are lowercase, e.g. `IMG_0156.jpeg` → `img-0156.jpg`.
Only the optimized copies are committed. Never put originals in `web/public/`: everything there ships unchanged to visitors.
