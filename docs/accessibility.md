# Accessibility results

Checked 2026-10-12 against a production build served at the site root.

## Lighthouse (desktop defaults, headless Chrome)

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Home | 98 | 96, then fixed (see below) | 100 | 100 |
| Services, Gallery, Contact, Careers, FAQ | 98 | 100 | 100 | 100 |

LCP 2.0 s, layout shift under 0.003, blocking time 0 ms on every page.

The one Home finding was the hero slide dots (10px, below the 24px minimum touch target). They now have a 24px tappable area with the same look.

## Contrast (WCAG AA)

Every text and background pairing the site renders was measured: 48 pairings, all pass (4.5:1 for text, 3:1 for large script text and for UI parts like icons, stars and focus rings).

The original design tokens failed 20 of 58 pairings. These adjustments fixed them, all within the brand palette:

- Muted text: chocolate at 85% (was 72%).
- Muted text on dark: ivory at 90% (was 75%), and full ivory on olive, where nothing less reaches 4.5:1.
- Script "gold" text: `#A8662A` (the logo caramel `#BF7B3F` is 2.9:1 on linen). Caramel is still used on dark surfaces and as a non-text accent.
- Focus ring: chocolate with an ivory halo, visible on light and dark surfaces alike (caramel was 2.9:1 on linen).
- Eyebrows on terracotta and olive use ivory instead of sand; careers header uses chocolate instead of sage; text buttons use chocolate; the caramel badge was removed.

## Other checks

- No horizontal scrolling on any of the 9 pages at 375, 768 and 1280 px.
- Keyboard: Tab order follows the page, focus ring visible, a "Skip to content" link appears on first Tab.
- Reduced motion: all content visible with no transform, and transitions shortened to near zero.
- Not yet tested: a screen reader pass, and real photos (all current images are placeholders without alt text needs).
