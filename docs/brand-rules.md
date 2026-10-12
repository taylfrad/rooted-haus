# Brand rules

Source of truth: the "The Rooted Haus" design system project. Its tokens are copied into `web/src/styles/tokens/`; if the design changes there, update them here. The React components and website UI kit from that project are ported to Astro in `web/src/components/` and `web/src/pages/`.

Accessibility adjustments to the original tokens (measured against WCAG AA): muted text alpha .72 to .85; on-dark muted text alpha .75 to .9, with full ivory on olive; script "gold" `#BF7B3F` to `#A8662A`; focus ring is chocolate with an ivory halo instead of caramel; text buttons use chocolate; no caramel badge.

- **Color.** Seven logo colors plus derived espresso, linen and oat. Never pure black or white (client request). Sections alternate linen, ivory, olive, sand and espresso. Primary action is terracotta with ivory text; caramel is the "gold" accent.
- **Type.** Gilda Display for headlines (stand-in for Cassy Vogue), Montserrat for body and spaced capitals (stand-in for Gotham Pro), Sacramento script for 2 to 5 lowercase words, at most one per screen area. Headlines in sentence case.
- **Shape.** Pill buttons and inputs, 28px cards, arch / circle / rounded photos. Never sharp rectangles. Flat color cards without borders; interactive cards lift 4px on hover.
- **Motion.** Fade and 16px rise over 900ms with `cubic-bezier(.22,.61,.36,1)`, 150ms stagger; hero slides cross-fade 1.2s. No bounces, zooms or parallax. Respect reduced-motion.
- **Icons.** Lucide, stroke 1.5, small and functional, often inside a 44px sand circle.
- **Voice.** "We", warm and a little poetic, more detail than punch. Buttons are 2 to 4 verbs ("Book an appointment"). No emoji, no hype words.
- **Photography.** Warm, natural light, slight sepia (`--photo-warmth`); never cool or black and white.
